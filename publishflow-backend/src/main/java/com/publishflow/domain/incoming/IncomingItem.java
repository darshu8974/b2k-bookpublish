package com.publishflow.domain.incoming;

import com.publishflow.infrastructure.persistence.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * One attachment imported from an incoming email. These land in a general
 * "Incoming" area (not tied to a project) for the team to pick up.
 */
@Entity
@Table(name = "incoming_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncomingItem extends BaseEntity {

    @Column(name = "sender")
    private String sender;

    @Column(name = "subject", length = 1000)
    private String subject;

    @Column(name = "message_id", length = 500)
    private String messageId;

    @Column(name = "received_at")
    private LocalDateTime receivedAt;

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

    /** Whether someone has dealt with this item yet. */
    @Column(name = "is_handled", nullable = false)
    @Builder.Default
    private boolean handled = false;
}
