package com.publishflow.domain.input;

import com.publishflow.common.response.ApiResponse;
import com.publishflow.domain.input.dto.InputItemResponse;
import com.publishflow.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/input")
@RequiredArgsConstructor
public class InputController {

    private final InputService inputService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InputItemResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.success(inputService.list()));
    }

    /** Move an Incoming item into the shared Input repository. */
    @PostMapping("/move/{incomingId}")
    public ResponseEntity<ApiResponse<InputItemResponse>> moveFromIncoming(
        @PathVariable String incomingId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Moved to Input",
                inputService.moveFromIncoming(incomingId, principal.getId())));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable String id) {
        InputItem item = inputService.getEntity(id);
        byte[] content = inputService.download(id);
        String filename = item.getOriginalFilename() != null ? item.getOriginalFilename() : "download";
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + filename.replaceAll("[\"\\r\\n]", "_") + "\"")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(content);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        inputService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted"));
    }
}
