package com.publishflow.domain.file.dto;

import com.publishflow.domain.file.UploadCategory;

import java.time.LocalDateTime;

public record FileUploadResponse(
    String id,
    String projectId,
    String originalFilename,
    Long fileSize,
    String contentType,
    UploadCategory category,
    String uploadedById,
    String uploadedByName,
    LocalDateTime createdAt
) {}
