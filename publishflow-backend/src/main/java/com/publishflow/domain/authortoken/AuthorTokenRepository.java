package com.publishflow.domain.authortoken;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuthorTokenRepository extends JpaRepository<AuthorToken, String> {

    Optional<AuthorToken> findByToken(String token);

    @Query("SELECT t FROM AuthorToken t WHERE t.project.id = :projectId ORDER BY t.createdAt DESC")
    List<AuthorToken> findByProjectId(@Param("projectId") String projectId);

    @Query("SELECT t FROM AuthorToken t WHERE t.status = 'PENDING' AND t.expiresAt < :now")
    List<AuthorToken> findExpired(@Param("now") LocalDateTime now);
}
