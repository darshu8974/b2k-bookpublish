package com.publishflow.domain.comment;

import com.publishflow.common.response.ApiResponse;
import com.publishflow.domain.comment.dto.CommentResponse;
import com.publishflow.domain.comment.dto.CreateCommentRequest;
import com.publishflow.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getAll(@PathVariable String projectId) {
        return ResponseEntity.ok(ApiResponse.success(commentService.getByProject(projectId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> create(
        @PathVariable String projectId,
        @Valid @RequestBody CreateCommentRequest request,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Comment added", commentService.create(projectId, request, principal.getId())));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<ApiResponse<Void>> delete(
        @PathVariable String projectId,
        @PathVariable String commentId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        commentService.delete(commentId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Comment deleted"));
    }
}
