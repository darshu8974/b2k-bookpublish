package com.publishflow.domain.report.dto;

import java.util.List;

public record StageThroughputReport(
    List<StageMetric> metrics
) {
    public record StageMetric(
        String stageName,
        long completed,
        long inProgress,
        long rejected
    ) {}
}
