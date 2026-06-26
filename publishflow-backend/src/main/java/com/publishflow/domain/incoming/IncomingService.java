package com.publishflow.domain.incoming;

import com.publishflow.common.exception.ResourceNotFoundException;
import com.publishflow.config.MailProperties;
import com.publishflow.domain.file.StorageStrategy;
import com.publishflow.domain.incoming.dto.IncomingItemResponse;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeUtility;
import jakarta.mail.search.FlagTerm;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class IncomingService {

    private static final long MAX_FILE_SIZE = 50L * 1024 * 1024;

    private final IncomingItemRepository repository;
    private final StorageStrategy storageStrategy;
    private final MailProperties mailProperties;

    // ─── App-facing queries ──────────────────────────────────────────────

    public List<IncomingItemResponse> list() {
        return repository.findByDeletedAtIsNullOrderByCreatedAtDesc()
            .stream().map(this::toResponse).toList();
    }

    public long unreadCount() {
        return repository.countByHandledFalseAndDeletedAtIsNull();
    }

    public IncomingItem getEntity(String id) {
        return repository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("IncomingItem", "id", id));
    }

    public byte[] download(String id) {
        return storageStrategy.retrieve(getEntity(id).getStoragePath());
    }

    @Transactional
    public IncomingItemResponse markHandled(String id, boolean handled) {
        IncomingItem item = getEntity(id);
        item.setHandled(handled);
        return toResponse(repository.save(item));
    }

    @Transactional
    public void delete(String id) {
        IncomingItem item = getEntity(id);
        storageStrategy.delete(item.getStoragePath());
        item.softDelete();
        repository.save(item);
    }

    // ─── Inbox import ────────────────────────────────────────────────────

    /**
     * Connects to the configured inbox, imports attachments from unseen
     * messages, and marks them read. Safe to call repeatedly. Returns the
     * number of attachments imported.
     */
    public int importFromInbox() {
        MailProperties.Inbound cfg = mailProperties.getInbound();
        if (!cfg.isEnabled()) {
            return 0;
        }
        if (!StringUtils.hasText(cfg.getUsername()) || !StringUtils.hasText(cfg.getPassword())) {
            log.warn("Inbound email is enabled but username/password are not set — skipping poll");
            return 0;
        }

        Properties props = new Properties();
        props.put("mail.store.protocol", "imaps");
        Session session = Session.getInstance(props);

        Store store = null;
        Folder inbox = null;
        int imported = 0;
        try {
            store = session.getStore("imaps");
            store.connect(cfg.getHost(), cfg.getPort(), cfg.getUsername(), cfg.getPassword());
            inbox = store.getFolder(cfg.getFolder());
            inbox.open(Folder.READ_WRITE);

            Message[] messages = inbox.search(new FlagTerm(new Flags(Flags.Flag.SEEN), false));
            for (Message message : messages) {
                try {
                    imported += processMessage(message);
                } catch (Exception e) {
                    log.error("Failed to process an incoming email: {}", e.getMessage());
                } finally {
                    try {
                        message.setFlag(Flags.Flag.SEEN, true);
                    } catch (Exception ignore) {
                        // best effort — leave unread if we can't flag it
                    }
                }
            }
        } catch (Exception e) {
            log.error("Inbound email poll failed: {}", e.getMessage());
        } finally {
            try {
                if (inbox != null && inbox.isOpen()) inbox.close(false);
            } catch (Exception ignore) {
            }
            try {
                if (store != null) store.close();
            } catch (Exception ignore) {
            }
        }

        if (imported > 0) {
            log.info("Imported {} attachment(s) from the inbox", imported);
        }
        return imported;
    }

    @Transactional
    protected int processMessage(Message message) throws Exception {
        String messageId = (message instanceof MimeMessage mime) ? mime.getMessageID() : null;
        if (messageId != null && repository.existsByMessageId(messageId)) {
            return 0; // already imported
        }

        String sender = extractSender(message);
        String subject = message.getSubject();
        Date date = message.getReceivedDate() != null ? message.getReceivedDate() : message.getSentDate();
        LocalDateTime receivedAt = date != null
            ? LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault())
            : null;

        List<Attachment> attachments = new ArrayList<>();
        collectAttachments(message, attachments);

        int count = 0;
        for (Attachment att : attachments) {
            String storedFilename = UUID.randomUUID() + "_" + sanitize(att.filename());
            String storagePath = storageStrategy.store(att.data(), storedFilename);

            IncomingItem item = IncomingItem.builder()
                .sender(sender)
                .subject(subject)
                .messageId(messageId)
                .receivedAt(receivedAt)
                .originalFilename(att.filename())
                .storedFilename(storedFilename)
                .fileSize((long) att.data().length)
                .contentType(att.contentType())
                .storagePath(storagePath)
                .handled(false)
                .build();
            repository.save(item);
            count++;
        }
        return count;
    }

    private void collectAttachments(Part part, List<Attachment> out) throws Exception {
        Object content;
        try {
            content = part.getContent();
        } catch (Exception e) {
            content = null;
        }

        if (content instanceof Multipart multipart) {
            for (int i = 0; i < multipart.getCount(); i++) {
                collectAttachments(multipart.getBodyPart(i), out);
            }
            return;
        }

        String filename = part.getFileName();
        if (!StringUtils.hasText(filename)) {
            return; // body text / no attachment here
        }

        byte[] data = part.getInputStream().readAllBytes();
        if (data.length > MAX_FILE_SIZE) {
            log.warn("Skipping oversized attachment '{}' ({} bytes)", filename, data.length);
            return;
        }
        out.add(new Attachment(MimeUtility.decodeText(filename), data, cleanContentType(part.getContentType())));
    }

    private String extractSender(Message message) throws MessagingException {
        Address[] from = message.getFrom();
        if (from != null && from.length > 0) {
            if (from[0] instanceof InternetAddress addr) {
                return addr.getAddress();
            }
            return from[0].toString();
        }
        return null;
    }

    private String cleanContentType(String contentType) {
        if (contentType == null) return null;
        int semi = contentType.indexOf(';');
        String ct = semi > 0 ? contentType.substring(0, semi).trim() : contentType.trim();
        return ct.length() > 200 ? ct.substring(0, 200) : ct;
    }

    private String sanitize(String filename) {
        if (filename == null) return "file";
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private IncomingItemResponse toResponse(IncomingItem i) {
        return new IncomingItemResponse(
            i.getId(),
            i.getSender(),
            i.getSubject(),
            i.getReceivedAt(),
            i.getOriginalFilename(),
            i.getFileSize(),
            i.getContentType(),
            i.isHandled(),
            i.getCreatedAt()
        );
    }

    private record Attachment(String filename, byte[] data, String contentType) {
    }
}
