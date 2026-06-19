package com.publishflow.domain.workflow.dto;

import jakarta.validation.constraints.NotBlank;

public record RejectStageRequest(
    @NotBlank(message = "Rejection reason is required")
    String reason
) {}
