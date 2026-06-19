package com.publishflow.domain.project.dto;

import com.publishflow.domain.project.ProjectPriority;
import com.publishflow.domain.project.ProjectStatus;

import java.time.LocalDate;

public record UpdateProjectRequest(
    String title,
    String description,
    String projectManagerId,
    ProjectPriority priority,
    ProjectStatus status,
    LocalDate dueDate
) {}
