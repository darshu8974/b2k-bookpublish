package com.publishflow.domain.comment.dto;

import java.time.LocalDateTime;
import java.util.List;

public record CommentResponse(
    String id,
    String projectId,
    String authorId,
    String authorName,
    String authorAvatarUrl,
    String content,
    String parentId,
    List<CommentResponse> replies,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
