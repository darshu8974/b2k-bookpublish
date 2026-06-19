package com.publishflow.domain.project.dto;

import com.publishflow.domain.project.ProjectPriority;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateProjectRequest(
    @NotBlank(message = "Title is required")
    String title,

    String description,

    @NotBlank(message = "Customer ID is required")
    String customerId,

    String projectManagerId,

    @NotNull(message = "Priority is required")
    ProjectPriority priority,

    @NotNull(message = "Due date is required")
    @FutureOrPresent(message = "Due date cannot be in the past")
    LocalDate dueDate
) {}
