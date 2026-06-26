package com.publishflow.domain.template;

import com.publishflow.common.response.ApiResponse;
import com.publishflow.common.response.PagedResponse;
import com.publishflow.domain.template.dto.CreateTemplateRequest;
import com.publishflow.domain.template.dto.TemplateResponse;
import com.publishflow.domain.template.dto.UpdateTemplateRequest;
import com.publishflow.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/templates")
@RequiredArgsConstructor
public class TemplateController {

    private final TemplateService templateService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<TemplateResponse>>> getAll(
        @RequestParam(required = false) String type,
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(templateService.getAll(type, search, page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TemplateResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(templateService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TemplateResponse>> create(
        @RequestBody CreateTemplateRequest request,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Template created", templateService.create(request, principal.getId())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TemplateResponse>> update(
        @PathVariable String id,
        @RequestBody UpdateTemplateRequest request,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(ApiResponse.success("Template updated",
            templateService.update(id, request, principal.getId())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
        @PathVariable String id,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        templateService.delete(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Template deleted"));
    }
}
