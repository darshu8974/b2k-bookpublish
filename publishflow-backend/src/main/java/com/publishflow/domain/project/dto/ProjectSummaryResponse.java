package com.publishflow.domain.project.dto;

import com.publishflow.domain.project.ProjectPriority;
import com.publishflow.domain.project.ProjectStatus;
import com.publishflow.domain.workflow.WorkflowStageName;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ProjectSummaryResponse(
    String id,
    String projectCode,
    String title,
    String customerName,
    String projectManagerName,
    WorkflowStageName currentStage,
    ProjectStatus status,
    ProjectPriority priority,
    LocalDate dueDate,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    int completedStages,
    int totalStages
) {}
