package com.publishflow.domain.comment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {

    @Query("""
        SELECT c FROM Comment c
        LEFT JOIN FETCH c.author
        LEFT JOIN FETCH c.replies r
        LEFT JOIN FETCH r.author
        WHERE c.project.id = :projectId
        AND c.parent IS NULL
        AND c.deletedAt IS NULL
        ORDER BY c.createdAt ASC
        """)
    List<Comment> findTopLevelByProjectId(@Param("projectId") String projectId);

    Optional<Comment> findByIdAndDeletedAtIsNull(String id);
}
