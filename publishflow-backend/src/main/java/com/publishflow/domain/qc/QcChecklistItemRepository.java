package com.publishflow.domain.qc;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QcChecklistItemRepository extends JpaRepository<QcChecklistItem, String> {
    List<QcChecklistItem> findByActiveTrueOrderBySortOrderAsc();
}
