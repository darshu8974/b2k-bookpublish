package com.publishflow.domain.audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, String> {

    @Query("""
        SELECT a FROM AuditLog a
        WHERE (:actorId IS NULL OR a.actorId = :actorId)
        AND (:action IS NULL OR a.action = :action)
        AND (:entityType IS NULL OR a.entityType = :entityType)
        AND (:entityId IS NULL OR a.entityId = :entityId)
        ORDER BY a.createdAt DESC
        """)
    Page<AuditLog> findFiltered(
        @Param("actorId") String actorId,
        @Param("action") AuditAction action,
        @Param("entityType") String entityType,
        @Param("entityId") String entityId,
        Pageable pageable
    );

    List<AuditLog> findByEntityIdOrderByCreatedAtDesc(String entityId);
}
