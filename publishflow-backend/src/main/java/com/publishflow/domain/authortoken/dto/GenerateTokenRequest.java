package com.publishflow.domain.authortoken.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record GenerateTokenRequest(
    @NotBlank(message = "Author email is required")
    @Email(message = "Must be a valid email address")
    String authorEmail,

    String authorName,

    Integer expiryDays
) {}
