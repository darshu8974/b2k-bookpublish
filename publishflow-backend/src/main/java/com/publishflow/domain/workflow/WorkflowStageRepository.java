package com.publishflow.domain.workflow;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface WorkflowStageRepository extends JpaRepository<WorkflowStage, String> {

    List<WorkflowStage> findByProjectIdOrderByStageOrderAsc(String projectId);

    Optional<WorkflowStage> findByProjectIdAndStageName(String projectId, WorkflowStageName stageName);

    @Query("SELECT ws FROM WorkflowStage ws WHERE ws.project.id = :projectId AND ws.deletedAt IS NULL ORDER BY ws.stageOrder ASC")
    List<WorkflowStage> findActiveByProjectId(@Param("projectId") String projectId);

    long countByProjectIdAndStatus(String projectId, WorkflowStageStatus status);

    @Query("""
        SELECT ws.stageName, ws.status, COUNT(ws)
        FROM WorkflowStage ws
        WHERE ws.deletedAt IS NULL
        GROUP BY ws.stageName, ws.status
        """)
    List<Object[]> countGroupByStageAndStatus();

    @Query("""
        SELECT ws.assignedTo.id, ws.assignedTo.fullName, ws.status, COUNT(ws)
        FROM WorkflowStage ws
        WHERE ws.assignedTo IS NOT NULL AND ws.deletedAt IS NULL
        GROUP BY ws.assignedTo.id, ws.assignedTo.fullName, ws.status
        """)
    List<Object[]> countGroupByAssigneeAndStatus();
}
