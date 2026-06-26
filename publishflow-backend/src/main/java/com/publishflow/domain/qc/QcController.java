package com.publishflow.domain.qc;

import com.publishflow.common.response.ApiResponse;
import com.publishflow.domain.qc.dto.QcChecklistResponse;
import com.publishflow.domain.qc.dto.SubmitQcRequest;
import com.publishflow.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/qc-checklist")
@RequiredArgsConstructor
public class QcController {

    private final QcService qcService;

    @GetMapping
    public ResponseEntity<ApiResponse<QcChecklistResponse>> get(@PathVariable String projectId) {
        return ResponseEntity.ok(ApiResponse.success(qcService.getChecklist(projectId)));
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<QcChecklistResponse>> submit(
        @PathVariable String projectId,
        @RequestBody SubmitQcRequest request,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(ApiResponse.success("QC checklist saved",
            qcService.submit(projectId, request, principal.getId())));
    }
}
