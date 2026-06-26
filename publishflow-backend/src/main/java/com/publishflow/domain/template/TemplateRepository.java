package com.publishflow.domain.template;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TemplateRepository extends JpaRepository<Template, String> {

    @Query("""
        SELECT t FROM Template t
        WHERE t.deletedAt IS NULL
          AND (:type = '' OR t.type = :type)
          AND (:search = '' OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(COALESCE(t.tags, '')) LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<Template> findAllActive(
        @Param("type") String type,
        @Param("search") String search,
        Pageable pageable
    );
}
