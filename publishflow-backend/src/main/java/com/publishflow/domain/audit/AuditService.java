package com.publishflow.domain.audit;

import com.publishflow.common.response.PagedResponse;
import com.publishflow.domain.audit.dto.ActivityEventResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(String actorId, String actorName, AuditAction action,
                    String entityType, String entityId, String details) {
        AuditLog entry = AuditLog.builder()
            .actorId(actorId)
            .actorName(actorName)
            .action(action)
            .entityType(entityType)
            .entityId(entityId)
            .details(details)
            .build();
        auditLogRepository.save(entry);
    }

    public PagedResponse<AuditLog> getAll(String actorId, String actionStr, String entityType, String entityId, int page, int size) {
        AuditAction action = actionStr != null ? AuditAction.valueOf(actionStr.toUpperCase()) : null;
        return PagedResponse.of(
            auditLogRepository.findFiltered(actorId, action, entityType, entityId, PageRequest.of(page, size)),
            log -> log
        );
    }

    @Transactional(readOnly = true)
    public List<ActivityEventResponse> getForProject(String projectId) {
        return auditLogRepository.findByEntityIdOrderByCreatedAtDesc(projectId)
            .stream()
            .map(log -> new ActivityEventResponse(
                log.getId(),
                log.getAction().name(),
                log.getActorId(),
                log.getActorName(),
                log.getDetails(),
                log.getCreatedAt()
            ))
            .toList();
    }
}
