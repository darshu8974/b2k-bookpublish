package com.publishflow.domain.authortoken.dto;

import java.time.LocalDateTime;

public record AuthorPortalResponse(
    String token,
    String projectTitle,
    String projectCode,
    String customerName,
    String authorEmail,
    String authorName,
    String status,
    LocalDateTime expiresAt
) {}
