package com.publishflow.domain.incoming.dto;

import java.time.LocalDateTime;

public record IncomingItemResponse(
    String id,
    String sender,
    String subject,
    LocalDateTime receivedAt,
    String originalFilename,
    Long fileSize,
    String contentType,
    boolean handled,
    LocalDateTime createdAt
) {
}
