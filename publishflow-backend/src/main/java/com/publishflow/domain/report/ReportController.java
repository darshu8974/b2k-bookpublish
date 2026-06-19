package com.publishflow.domain.report;

import com.publishflow.common.response.ApiResponse;
import com.publishflow.domain.report.dto.ProjectStatusReport;
import com.publishflow.domain.report.dto.StageThroughputReport;
import com.publishflow.domain.report.dto.TeamWorkloadReport;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER')")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/project-status")
    public ResponseEntity<ApiResponse<ProjectStatusReport>> projectStatus() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getProjectStatus()));
    }

    @GetMapping("/stage-throughput")
    public ResponseEntity<ApiResponse<StageThroughputReport>> stageThroughput() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getStageThroughput()));
    }

    @GetMapping("/team-workload")
    public ResponseEntity<ApiResponse<TeamWorkloadReport>> teamWorkload() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getTeamWorkload()));
    }
}
