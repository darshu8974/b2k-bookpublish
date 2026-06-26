package com.publishflow.domain.authortoken;

import com.publishflow.common.response.ApiResponse;
import com.publishflow.domain.authortoken.dto.AuthorPortalResponse;
import com.publishflow.domain.authortoken.dto.AuthorRespondRequest;
import com.publishflow.domain.authortoken.dto.AuthorTokenResponse;
import com.publishflow.domain.authortoken.dto.GenerateTokenRequest;
import com.publishflow.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AuthorTokenController {

    private final AuthorTokenService tokenService;

    @PostMapping("/api/v1/projects/{projectId}/author-token")
    public ResponseEntity<ApiResponse<AuthorTokenResponse>> generate(
        @PathVariable String projectId,
        @RequestBody @Valid GenerateTokenRequest request,
        Authentication auth
    ) {
        String userId = ((UserPrincipal) auth.getPrincipal()).getId();
        return ResponseEntity.ok(ApiResponse.success(tokenService.generate(projectId, request, userId)));
    }

    @GetMapping("/api/v1/projects/{projectId}/author-token")
    public ResponseEntity<ApiResponse<List<AuthorTokenResponse>>> list(@PathVariable String projectId) {
        return ResponseEntity.ok(ApiResponse.success(tokenService.getForProject(projectId)));
    }

    @GetMapping("/api/v1/author/review")
    public ResponseEntity<ApiResponse<AuthorPortalResponse>> getPortal(@RequestParam String token) {
        return ResponseEntity.ok(ApiResponse.success(tokenService.getPortalInfo(token)));
    }

    @PostMapping("/api/v1/author/review/approve")
    public ResponseEntity<ApiResponse<String>> approve(@RequestBody @Valid AuthorRespondRequest request) {
        tokenService.approve(request);
        return ResponseEntity.ok(ApiResponse.success("Thank you! Your approval has been recorded."));
    }

    @PostMapping("/api/v1/author/review/reject")
    public ResponseEntity<ApiResponse<String>> reject(@RequestBody @Valid AuthorRespondRequest request) {
        tokenService.reject(request);
        return ResponseEntity.ok(ApiResponse.success("Your feedback has been recorded. The team will be notified."));
    }
}
