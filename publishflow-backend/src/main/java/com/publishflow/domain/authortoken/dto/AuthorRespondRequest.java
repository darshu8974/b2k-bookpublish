package com.publishflow.domain.authortoken.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthorRespondRequest(
    @NotBlank(message = "Token is required")
    String token,

    String comment
) {}
