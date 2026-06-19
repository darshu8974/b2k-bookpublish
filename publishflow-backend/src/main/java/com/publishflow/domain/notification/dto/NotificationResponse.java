package com.publishflow.domain.notification.dto;

import com.publishflow.domain.notification.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponse(
    String id,
    NotificationType type,
    String title,
    String message,
    String entityType,
    String entityId,
    boolean read,
    LocalDateTime createdAt
) {}
