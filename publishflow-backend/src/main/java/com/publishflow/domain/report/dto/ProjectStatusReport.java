package com.publishflow.domain.report.dto;

import java.util.Map;

public record ProjectStatusReport(
    long totalProjects,
    long activeProjects,
    long completedProjects,
    long onHoldProjects,
    long cancelledProjects,
    Map<String, Long> byPriority,
    Map<String, Long> byStage
) {}
