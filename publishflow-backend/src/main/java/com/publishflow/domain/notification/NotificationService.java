package com.publishflow.domain.notification;

import com.publishflow.common.response.PagedResponse;
import com.publishflow.domain.notification.dto.NotificationResponse;
import com.publishflow.domain.user.User;
import com.publishflow.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Async
    @Transactional
    public void send(String recipientId, NotificationType type, String title, String message,
                     String entityType, String entityId) {
        userRepository.findByIdAndDeletedAtIsNull(recipientId).ifPresent(recipient -> {
            Notification n = Notification.builder()
                .recipient(recipient)
                .type(type)
                .title(title)
                .message(message)
                .entityType(entityType)
                .entityId(entityId)
                .build();
            notificationRepository.save(n);
        });
    }

    public PagedResponse<NotificationResponse> getForUser(String userId, int page, int size) {
        return PagedResponse.of(
            notificationRepository.findByRecipientIdAndDeletedAtIsNullOrderByCreatedAtDesc(
                userId, PageRequest.of(page, size)),
            this::toResponse
        );
    }

    public long countUnread(String userId) {
        return notificationRepository.countByRecipientIdAndReadFalseAndDeletedAtIsNull(userId);
    }

    @Transactional
    public void markAllRead(String userId) {
        notificationRepository.markAllReadForUser(userId);
    }

    @Transactional
    public void markRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    private NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(
            n.getId(), n.getType(), n.getTitle(), n.getMessage(),
            n.getEntityType(), n.getEntityId(), n.isRead(), n.getCreatedAt()
        );
    }
}
