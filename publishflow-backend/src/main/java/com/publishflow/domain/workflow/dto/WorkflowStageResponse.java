package com.publishflow.domain.workflow.dto;

import com.publishflow.domain.workflow.WorkflowStageName;
import com.publishflow.domain.workflow.WorkflowStageStatus;

import java.time.LocalDateTime;

public record WorkflowStageResponse(
    String id,
    WorkflowStageName stageName,
    int stageOrder,
    WorkflowStageStatus status,
    String assignedToId,
    String assignedToName,
    String remarks,
    LocalDateTime startedAt,
    LocalDateTime completedAt,
    LocalDateTime createdAt
) {}
