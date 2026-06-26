package com.publishflow.domain.authortoken.dto;

import java.time.LocalDateTime;

public record AuthorTokenResponse(
    String id,
    String projectId,
    String projectTitle,
    String token,
    String reviewUrl,
    String authorEmail,
    String authorName,
    String status,
    String comment,
    LocalDateTime expiresAt,
    LocalDateTime decidedAt,
    LocalDateTime createdAt
) {}
