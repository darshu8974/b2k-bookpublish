package com.publishflow.domain.file;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileUploadRepository extends JpaRepository<FileUpload, String> {

    @Query("SELECT f FROM FileUpload f LEFT JOIN FETCH f.uploadedBy WHERE f.project.id = :projectId AND f.deletedAt IS NULL ORDER BY f.createdAt DESC")
    List<FileUpload> findByProjectId(@Param("projectId") String projectId);

    Optional<FileUpload> findByIdAndDeletedAtIsNull(String id);
}
