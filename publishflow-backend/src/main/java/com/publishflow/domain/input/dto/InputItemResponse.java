package com.publishflow.domain.input.dto;

import java.time.LocalDateTime;

public record InputItemResponse(
    String id,
    String originalFilename,
    Long fileSize,
    String contentType,
    String source,
    String addedById,
    String addedByName,
    LocalDateTime createdAt
) {
}
