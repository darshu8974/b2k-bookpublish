package com.publishflow.domain.workflow.dto;

import jakarta.validation.constraints.NotBlank;

public record AssignStageRequest(
    @NotBlank(message = "User ID is required")
    String userId
) {}
