package com.publishflow.domain.incoming;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IncomingItemRepository extends JpaRepository<IncomingItem, String> {

    List<IncomingItem> findByDeletedAtIsNullOrderByCreatedAtDesc();

    Optional<IncomingItem> findByIdAndDeletedAtIsNull(String id);

    boolean existsByMessageId(String messageId);

    long countByHandledFalseAndDeletedAtIsNull();
}
