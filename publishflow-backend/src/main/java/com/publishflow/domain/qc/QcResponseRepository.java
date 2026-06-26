package com.publishflow.domain.qc;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface QcResponseRepository extends JpaRepository<QcResponse, String> {

    @Query("SELECT r FROM QcResponse r WHERE r.project.id = :projectId ORDER BY r.item.sortOrder ASC")
    List<QcResponse> findByProjectId(@Param("projectId") String projectId);

    @Query("SELECT r FROM QcResponse r WHERE r.project.id = :projectId AND r.item.id = :itemId")
    Optional<QcResponse> findByProjectAndItem(@Param("projectId") String projectId, @Param("itemId") String itemId);

    @Query("SELECT COUNT(r) FROM QcResponse r WHERE r.project.id = :projectId AND r.checked = true")
    long countCheckedByProjectId(@Param("projectId") String projectId);
}
