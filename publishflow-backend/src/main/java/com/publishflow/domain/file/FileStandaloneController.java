package com.publishflow.domain.file;

import com.publishflow.common.response.ApiResponse;
import com.publishflow.domain.file.dto.FileUploadResponse;
import com.publishflow.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Convenience endpoints that don't require projectId in the path.
 * Used when the caller only has a fileId (e.g. direct download links).
 */
@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileStandaloneController {

    private final FileService fileService;

    @GetMapping("/{fileId}/download")
    public ResponseEntity<byte[]> download(@PathVariable String fileId) {
        FileUploadResponse meta = fileService.getById(fileId);
        byte[] content = fileService.download(fileId);
        String contentType = meta.contentType() != null ? meta.contentType() : "application/octet-stream";
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + meta.originalFilename() + "\"")
            .contentType(MediaType.parseMediaType(contentType))
            .body(content);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<ApiResponse<Void>> delete(
        @PathVariable String fileId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        fileService.delete(fileId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("File deleted"));
    }
}
