package com.publishflow.domain.input;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InputItemRepository extends JpaRepository<InputItem, String> {

    @Query("SELECT i FROM InputItem i LEFT JOIN FETCH i.addedBy WHERE i.deletedAt IS NULL ORDER BY i.createdAt DESC")
    List<InputItem> findAllActive();

    Optional<InputItem> findByIdAndDeletedAtIsNull(String id);
}
