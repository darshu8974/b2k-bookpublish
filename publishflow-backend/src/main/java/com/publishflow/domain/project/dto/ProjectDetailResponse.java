package com.publishflow.domain.project.dto;

import com.publishflow.domain.project.ProjectPriority;
import com.publishflow.domain.project.ProjectStatus;
import com.publishflow.domain.workflow.WorkflowStageName;
import com.publishflow.domain.workflow.dto.WorkflowStageResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record ProjectDetailResponse(
    String id,
    String projectCode,
    String title,
    String description,
    String customerId,
    String customerName,
    String projectManagerId,
    String projectManagerName,
    String createdById,
    String createdByName,
    WorkflowStageName currentStage,
    ProjectStatus status,
    ProjectPriority priority,
    LocalDate dueDate,
    LocalDateTime startedAt,
    LocalDateTime completedAt,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    List<WorkflowStageResponse> stages
) {}
