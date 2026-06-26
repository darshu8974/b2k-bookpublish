package com.publishflow.domain.incoming;

import com.publishflow.common.response.ApiResponse;
import com.publishflow.domain.incoming.dto.IncomingItemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/incoming")
@RequiredArgsConstructor
public class IncomingController {

    private final IncomingService incomingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<IncomingItemResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.success(incomingService.list()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> unreadCount() {
        return ResponseEntity.ok(ApiResponse.success(incomingService.unreadCount()));
    }

    /** Manually trigger an inbox check (instead of waiting for the scheduler). */
    @PostMapping("/poll")
    public ResponseEntity<ApiResponse<Integer>> pollNow() {
        int imported = incomingService.importFromInbox();
        return ResponseEntity.ok(ApiResponse.success("Checked inbox", imported));
    }

    @PatchMapping("/{id}/handled")
    public ResponseEntity<ApiResponse<IncomingItemResponse>> markHandled(
        @PathVariable String id,
        @RequestParam(defaultValue = "true") boolean handled
    ) {
        return ResponseEntity.ok(ApiResponse.success(incomingService.markHandled(id, handled)));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable String id) {
        IncomingItem item = incomingService.getEntity(id);
        byte[] content = incomingService.download(id);
        String filename = item.getOriginalFilename() != null ? item.getOriginalFilename() : "download";
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + filename.replaceAll("[\"\\r\\n]", "_") + "\"")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(content);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        incomingService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted"));
    }
}
