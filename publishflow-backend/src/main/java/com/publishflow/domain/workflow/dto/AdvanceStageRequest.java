package com.publishflow.domain.workflow.dto;

import jakarta.validation.constraints.NotBlank;

public record AdvanceStageRequest(
    @NotBlank(message = "Stage name is required")
    String stageName,

    String remarks
) {}
