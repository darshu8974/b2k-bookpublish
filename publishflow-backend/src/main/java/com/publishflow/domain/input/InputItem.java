package com.publishflow.domain.input;

import com.publishflow.domain.user.User;
import com.publishflow.infrastructure.persistence.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * A file in the shared, app-wide "Input" repository. Flat (no folders) for now.
 * Everyone who logs in sees the same items and can download/remove them.
 */
@Entity
@Table(name = "input_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InputItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "added_by")
    private User addedBy;

    @Column(name = "original_filename", nullable = false)
    private String originalFilename;

    @Column(name = "stored_filename", nullable = false, unique = true)
    private String storedFilename;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "content_type", length = 200)
    private String contentType;

    @Column(name = "storage_path", nullable = false, length = 1000)
    private String storagePath;

    /** Where it came from, e.g. EMAIL (moved from Incoming) or UPLOAD. */
    @Column(name = "source", nullable = false, length = 30)
    @Builder.Default
    private String source = "EMAIL";
}
