package com.publishflow.domain.input;

import com.publishflow.common.exception.ResourceNotFoundException;
import com.publishflow.domain.file.StorageStrategy;
import com.publishflow.domain.incoming.IncomingItem;
import com.publishflow.domain.incoming.IncomingItemRepository;
import com.publishflow.domain.input.dto.InputItemResponse;
import com.publishflow.domain.user.User;
import com.publishflow.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InputService {

    private final InputItemRepository inputItemRepository;
    private final IncomingItemRepository incomingItemRepository;
    private final UserRepository userRepository;
    private final StorageStrategy storageStrategy;

    public List<InputItemResponse> list() {
        return inputItemRepository.findAllActive().stream().map(this::toResponse).toList();
    }

    public InputItem getEntity(String id) {
        return inputItemRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("InputItem", "id", id));
    }

    public byte[] download(String id) {
        return storageStrategy.retrieve(getEntity(id).getStoragePath());
    }

    @Transactional
    public void delete(String id) {
        InputItem item = getEntity(id);
        storageStrategy.delete(item.getStoragePath());
        item.softDelete();
        inputItemRepository.save(item);
    }

    /**
     * Moves a file from the Incoming area into the shared Input repository:
     * copies the bytes into Input storage, records it, then removes the
     * original from Incoming. A true move — it leaves Incoming.
     */
    @Transactional
    public InputItemResponse moveFromIncoming(String incomingId, String userId) {
        IncomingItem incoming = incomingItemRepository.findByIdAndDeletedAtIsNull(incomingId)
            .orElseThrow(() -> new ResourceNotFoundException("IncomingItem", "id", incomingId));

        User addedBy = userId != null
            ? userRepository.findByIdAndDeletedAtIsNull(userId).orElse(null)
            : null;

        byte[] bytes = storageStrategy.retrieve(incoming.getStoragePath());
        String storedFilename = UUID.randomUUID() + "_" + sanitize(incoming.getOriginalFilename());
        String storagePath = storageStrategy.store(bytes, storedFilename);

        InputItem item = InputItem.builder()
            .addedBy(addedBy)
            .originalFilename(incoming.getOriginalFilename())
            .storedFilename(storedFilename)
            .fileSize(incoming.getFileSize())
            .contentType(incoming.getContentType())
            .storagePath(storagePath)
            .source("EMAIL")
            .build();
        InputItem saved = inputItemRepository.save(item);

        // Remove the original from Incoming (delete its file + soft-delete the row)
        storageStrategy.delete(incoming.getStoragePath());
        incoming.softDelete();
        incomingItemRepository.save(incoming);

        return toResponse(saved);
    }

    private String sanitize(String filename) {
        if (filename == null) return "file";
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private InputItemResponse toResponse(InputItem i) {
        return new InputItemResponse(
            i.getId(),
            i.getOriginalFilename(),
            i.getFileSize(),
            i.getContentType(),
            i.getSource(),
            i.getAddedBy() != null ? i.getAddedBy().getId() : null,
            i.getAddedBy() != null ? i.getAddedBy().getFullName() : null,
            i.getCreatedAt()
        );
    }
}
