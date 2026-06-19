package com.publishflow.domain.project;

import com.publishflow.common.response.ApiResponse;
import com.publishflow.common.response.PagedResponse;
import com.publishflow.domain.audit.AuditService;
import com.publishflow.domain.audit.dto.ActivityEventResponse;
import com.publishflow.domain.project.dto.*;
import com.publishflow.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ProjectSummaryResponse>>> getAll(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String priority,
        @RequestParam(required = false) String stage,
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(
            projectService.getAll(status, priority, stage, search, page, size)
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDetailResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(projectService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER')")
    public ResponseEntity<ApiResponse<ProjectDetailResponse>> create(
        @Valid @RequestBody CreateProjectRequest request,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Project created", projectService.create(request, principal.getId())));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER')")
    public ResponseEntity<ApiResponse<ProjectDetailResponse>> update(
        @PathVariable String id,
        @Valid @RequestBody UpdateProjectRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Project updated", projectService.update(id, request)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER')")
    public ResponseEntity<ApiResponse<ProjectDetailResponse>> updateStatus(
        @PathVariable String id,
        @RequestBody Map<String, String> body
    ) {
        return ResponseEntity.ok(ApiResponse.success("Project status updated",
            projectService.updateStatus(id, body.get("status"))));
    }

    @GetMapping("/{id}/activity")
    public ResponseEntity<ApiResponse<List<ActivityEventResponse>>> getActivity(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(auditService.getForProject(id)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        projectService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted"));
    }
}
