package com.publishflow.domain.comment.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateCommentRequest(
    @NotBlank(message = "Content is required")
    String content,

    String parentId
) {}
