package com.publishflow.domain.workflow;

import com.publishflow.common.response.ApiResponse;
import com.publishflow.domain.workflow.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/workflow")
@RequiredArgsConstructor
public class WorkflowController {

    private final WorkflowService workflowService;

    @GetMapping("/stages")
    public ResponseEntity<ApiResponse<List<WorkflowStageResponse>>> getStages(
        @PathVariable String projectId
    ) {
        return ResponseEntity.ok(ApiResponse.success(workflowService.getStages(projectId)));
    }

    @PostMapping("/advance")
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER','PRODUCTION_TEAM','QC_TEAM')")
    public ResponseEntity<ApiResponse<WorkflowStageResponse>> advanceStage(
        @PathVariable String projectId,
        @Valid @RequestBody AdvanceStageRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
            "Stage advanced",
            workflowService.advanceStage(projectId, request.stageName(), request.remarks())
        ));
    }

    @PostMapping("/reject")
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER','QC_TEAM')")
    public ResponseEntity<ApiResponse<WorkflowStageResponse>> rejectStage(
        @PathVariable String projectId,
        @Valid @RequestBody RejectStageRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
            "Stage rejected",
            workflowService.rejectStage(projectId, request.reason())
        ));
    }

    @PostMapping("/stages/{stageName}/assign")
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER')")
    public ResponseEntity<ApiResponse<WorkflowStageResponse>> assignStage(
        @PathVariable String projectId,
        @PathVariable String stageName,
        @Valid @RequestBody AssignStageRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
            "Stage assigned",
            workflowService.assignStage(projectId, stageName, request.userId())
        ));
    }
}
