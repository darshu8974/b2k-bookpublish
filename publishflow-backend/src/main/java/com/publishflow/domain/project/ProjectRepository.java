package com.publishflow.domain.project;

import com.publishflow.domain.workflow.WorkflowStageName;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {

    Optional<Project> findByIdAndDeletedAtIsNull(String id);

    long countByProjectCodeStartingWith(String prefix);

    @Query("""
        SELECT p FROM Project p
        LEFT JOIN FETCH p.customer
        LEFT JOIN FETCH p.projectManager
        WHERE p.deletedAt IS NULL
        AND (:status IS NULL OR p.status = :status)
        AND (:priority IS NULL OR p.priority = :priority)
        AND (:currentStage IS NULL OR p.currentStage = :currentStage)
        AND (:search = '' OR
             LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR
             LOWER(p.projectCode) LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<Project> findAllFiltered(
        @Param("status") ProjectStatus status,
        @Param("priority") ProjectPriority priority,
        @Param("currentStage") WorkflowStageName currentStage,
        @Param("search") String search,
        Pageable pageable
    );

    @Query("""
        SELECT p FROM Project p
        LEFT JOIN FETCH p.stages s
        LEFT JOIN FETCH p.customer
        LEFT JOIN FETCH p.projectManager
        WHERE p.id = :id AND p.deletedAt IS NULL
        """)
    Optional<Project> findByIdWithStages(@Param("id") String id);

    @Query("SELECT p.status, COUNT(p) FROM Project p WHERE p.deletedAt IS NULL GROUP BY p.status")
    List<Object[]> countGroupByStatus();

    @Query("SELECT p.priority, COUNT(p) FROM Project p WHERE p.deletedAt IS NULL GROUP BY p.priority")
    List<Object[]> countGroupByPriority();

    @Query("SELECT p.currentStage, COUNT(p) FROM Project p WHERE p.deletedAt IS NULL GROUP BY p.currentStage")
    List<Object[]> countGroupByStage();

    @Query("SELECT COUNT(p) FROM Project p WHERE p.deletedAt IS NULL")
    long countNonDeleted();
}
