package com.publishflow.domain.report;

import com.publishflow.domain.project.ProjectRepository;
import com.publishflow.domain.project.ProjectStatus;
import com.publishflow.domain.report.dto.ProjectStatusReport;
import com.publishflow.domain.report.dto.StageThroughputReport;
import com.publishflow.domain.report.dto.TeamWorkloadReport;
import com.publishflow.domain.workflow.WorkflowStageName;
import com.publishflow.domain.workflow.WorkflowStageRepository;
import com.publishflow.domain.workflow.WorkflowStageStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ProjectRepository projectRepository;
    private final WorkflowStageRepository workflowStageRepository;

    @Transactional(readOnly = true)
    public ProjectStatusReport getProjectStatus() {
        long total = projectRepository.countNonDeleted();

        // One query: GROUP BY status
        Map<String, Long> byStatus = projectRepository.countGroupByStatus().stream()
            .collect(Collectors.toMap(r -> r[0].toString(), r -> (Long) r[1]));

        // One query: GROUP BY priority
        Map<String, Long> byPriority = projectRepository.countGroupByPriority().stream()
            .collect(Collectors.toMap(r -> r[0].toString(), r -> (Long) r[1]));

        // One query: GROUP BY currentStage
        Map<String, Long> byStage = projectRepository.countGroupByStage().stream()
            .collect(Collectors.toMap(r -> r[0].toString(), r -> (Long) r[1]));

        return new ProjectStatusReport(
            total,
            byStatus.getOrDefault(ProjectStatus.ACTIVE.name(), 0L),
            byStatus.getOrDefault(ProjectStatus.COMPLETED.name(), 0L),
            byStatus.getOrDefault(ProjectStatus.ON_HOLD.name(), 0L),
            byStatus.getOrDefault(ProjectStatus.CANCELLED.name(), 0L),
            byPriority,
            byStage
        );
    }

    @Transactional(readOnly = true)
    public StageThroughputReport getStageThroughput() {
        // One query: GROUP BY stageName, status
        Map<WorkflowStageName, Map<WorkflowStageStatus, Long>> grouped =
            workflowStageRepository.countGroupByStageAndStatus().stream()
                .collect(Collectors.groupingBy(
                    r -> (WorkflowStageName) r[0],
                    Collectors.toMap(r -> (WorkflowStageStatus) r[1], r -> (Long) r[2])
                ));

        List<StageThroughputReport.StageMetric> metrics = Arrays.stream(WorkflowStageName.values())
            .map(stage -> {
                Map<WorkflowStageStatus, Long> counts = grouped.getOrDefault(stage, Collections.emptyMap());
                return new StageThroughputReport.StageMetric(
                    stage.name(),
                    counts.getOrDefault(WorkflowStageStatus.COMPLETED, 0L),
                    counts.getOrDefault(WorkflowStageStatus.IN_PROGRESS, 0L),
                    counts.getOrDefault(WorkflowStageStatus.REJECTED, 0L)
                );
            })
            .toList();

        return new StageThroughputReport(metrics);
    }

    @Transactional(readOnly = true)
    public TeamWorkloadReport getTeamWorkload() {
        // One query: GROUP BY assignee, status
        List<Object[]> rows = workflowStageRepository.countGroupByAssigneeAndStatus();

        Map<String, List<Object[]>> byUser = rows.stream()
            .collect(Collectors.groupingBy(r -> r[0].toString()));

        List<TeamWorkloadReport.UserWorkload> workloads = byUser.entrySet().stream()
            .map(entry -> {
                String userId   = entry.getKey();
                String userName = entry.getValue().get(0)[1].toString();
                long assigned   = entry.getValue().stream().mapToLong(r -> (Long) r[3]).sum();
                long done       = entry.getValue().stream()
                    .filter(r -> r[2] == WorkflowStageStatus.COMPLETED)
                    .mapToLong(r -> (Long) r[3]).sum();
                long inProg     = entry.getValue().stream()
                    .filter(r -> r[2] == WorkflowStageStatus.IN_PROGRESS)
                    .mapToLong(r -> (Long) r[3]).sum();
                return new TeamWorkloadReport.UserWorkload(userId, userName, assigned, done, inProg);
            })
            .toList();

        return new TeamWorkloadReport(workloads);
    }
}
