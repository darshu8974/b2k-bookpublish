package com.publishflow.domain.file;

import com.publishflow.common.response.ApiResponse;
import com.publishflow.domain.file.dto.FileUploadResponse;
import com.publishflow.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FileUploadResponse>>> getAll(@PathVariable String projectId) {
        return ResponseEntity.ok(ApiResponse.success(fileService.getByProject(projectId)));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<FileUploadResponse>> upload(
        @PathVariable String projectId,
        @RequestParam("file") MultipartFile file,
        @RequestParam(defaultValue = "OTHER") String category,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("File uploaded", fileService.upload(projectId, file, category, principal.getId())));
    }

    @GetMapping("/{fileId}/download")
    public ResponseEntity<byte[]> download(
        @PathVariable String projectId,
        @PathVariable String fileId
    ) {
        byte[] content = fileService.download(fileId);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"download\"")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(content);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<ApiResponse<Void>> delete(
        @PathVariable String projectId,
        @PathVariable String fileId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        fileService.delete(fileId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("File deleted"));
    }
}
