package com.publishflow.domain.report.dto;

import java.util.List;

public record TeamWorkloadReport(
    List<UserWorkload> workloads
) {
    public record UserWorkload(
        String userId,
        String userName,
        long assignedStages,
        long completedStages,
        long inProgressStages
    ) {}
}
