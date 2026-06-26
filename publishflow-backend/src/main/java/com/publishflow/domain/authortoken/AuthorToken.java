package com.publishflow.domain.authortoken;

import com.publishflow.domain.project.Project;
import com.publishflow.infrastructure.persistence.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "author_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorToken extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "token", nullable = false, unique = true, length = 128)
    private String token;

    @Column(name = "author_email", nullable = false, length = 255)
    private String authorEmail;

    @Column(name = "author_name", length = 255)
    private String authorName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private AuthorTokenStatus status = AuthorTokenStatus.PENDING;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "decided_at")
    private LocalDateTime decidedAt;
}
