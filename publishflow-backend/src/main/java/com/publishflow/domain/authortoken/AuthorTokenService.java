package com.publishflow.domain.authortoken;

import com.publishflow.common.exception.BusinessRuleException;
import com.publishflow.common.exception.ResourceNotFoundException;
import com.publishflow.domain.audit.AuditAction;
import com.publishflow.domain.audit.AuditService;
import com.publishflow.domain.authortoken.dto.AuthorPortalResponse;
import com.publishflow.domain.authortoken.dto.AuthorRespondRequest;
import com.publishflow.domain.authortoken.dto.AuthorTokenResponse;
import com.publishflow.domain.authortoken.dto.GenerateTokenRequest;
import com.publishflow.domain.project.Project;
import com.publishflow.domain.project.ProjectRepository;
import com.publishflow.domain.user.User;
import com.publishflow.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthorTokenService {

    private final AuthorTokenRepository tokenRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Transactional
    public AuthorTokenResponse generate(String projectId, GenerateTokenRequest request, String userId) {
        Project project = projectRepository.findByIdAndDeletedAtIsNull(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        User actor = userRepository.findByIdAndDeletedAtIsNull(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Expire any previous PENDING tokens for this project
        tokenRepository.findByProjectId(projectId).stream()
            .filter(t -> t.getStatus() == AuthorTokenStatus.PENDING)
            .forEach(t -> {
                t.setStatus(AuthorTokenStatus.EXPIRED);
                tokenRepository.save(t);
            });

        String rawToken = UUID.randomUUID().toString().replace("-", "")
            + UUID.randomUUID().toString().replace("-", "");
        int days = (request.expiryDays() != null && request.expiryDays() > 0) ? request.expiryDays() : 7;

        AuthorToken saved = tokenRepository.save(AuthorToken.builder()
            .project(project)
            .token(rawToken)
            .authorEmail(request.authorEmail().trim())
            .authorName(request.authorName() != null ? request.authorName().trim() : null)
            .status(AuthorTokenStatus.PENDING)
            .expiresAt(LocalDateTime.now().plusDays(days))
            .build());

        auditService.log(userId, actor.getFullName(), AuditAction.AUTHOR_APPROVAL_SENT,
            "Project", projectId, "Sent for author approval to: " + request.authorEmail());

        return toResponse(saved);
    }

    @Transactional
    public AuthorPortalResponse getPortalInfo(String rawToken) {
        AuthorToken t = findValidToken(rawToken);
        Project p = t.getProject();
        return new AuthorPortalResponse(
            t.getToken(),
            p.getTitle(),
            p.getProjectCode(),
            p.getCustomer() != null ? p.getCustomer().getName() : null,
            t.getAuthorEmail(),
            t.getAuthorName(),
            t.getStatus().name(),
            t.getExpiresAt()
        );
    }

    @Transactional
    public void approve(AuthorRespondRequest request) {
        AuthorToken t = findValidToken(request.token());
        t.setStatus(AuthorTokenStatus.APPROVED);
        t.setComment(request.comment());
        t.setDecidedAt(LocalDateTime.now());
        tokenRepository.save(t);
        auditService.log("author", t.getAuthorEmail(), AuditAction.AUTHOR_APPROVED,
            "Project", t.getProject().getId(), "Author approved the proof");
    }

    @Transactional
    public void reject(AuthorRespondRequest request) {
        AuthorToken t = findValidToken(request.token());
        t.setStatus(AuthorTokenStatus.REJECTED);
        t.setComment(request.comment());
        t.setDecidedAt(LocalDateTime.now());
        tokenRepository.save(t);
        auditService.log("author", t.getAuthorEmail(), AuditAction.AUTHOR_REJECTED,
            "Project", t.getProject().getId(),
            "Author rejected the proof" + (request.comment() != null ? ": " + request.comment() : ""));
    }

    @Transactional(readOnly = true)
    public List<AuthorTokenResponse> getForProject(String projectId) {
        return tokenRepository.findByProjectId(projectId).stream()
            .map(this::toResponse)
            .toList();
    }

    private AuthorToken findValidToken(String rawToken) {
        AuthorToken t = tokenRepository.findByToken(rawToken)
            .orElseThrow(() -> new ResourceNotFoundException("Token", "token", rawToken));
        if (t.getExpiresAt().isBefore(LocalDateTime.now())) {
            if (t.getStatus() == AuthorTokenStatus.PENDING) {
                t.setStatus(AuthorTokenStatus.EXPIRED);
                tokenRepository.save(t);
            }
            throw new BusinessRuleException("This review link has expired.");
        }
        if (t.getStatus() != AuthorTokenStatus.PENDING) {
            throw new BusinessRuleException("This proof has already been " + t.getStatus().name().toLowerCase() + ".");
        }
        return t;
    }

    private AuthorTokenResponse toResponse(AuthorToken t) {
        return new AuthorTokenResponse(
            t.getId(),
            t.getProject().getId(),
            t.getProject().getTitle(),
            t.getToken(),
            frontendUrl + "/author/review?token=" + t.getToken(),
            t.getAuthorEmail(),
            t.getAuthorName(),
            t.getStatus().name(),
            t.getComment(),
            t.getExpiresAt(),
            t.getDecidedAt(),
            t.getCreatedAt()
        );
    }
}
