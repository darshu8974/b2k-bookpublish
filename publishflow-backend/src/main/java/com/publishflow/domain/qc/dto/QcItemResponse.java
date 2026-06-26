package com.publishflow.domain.qc.dto;

import com.publishflow.domain.qc.QcChecklistItem;
import com.publishflow.domain.qc.QcResponse;

import java.time.LocalDateTime;

public record QcItemResponse(
    String itemId,
    String label,
    String category,
    int sortOrder,
    boolean checked,
    String note,
    String answeredBy,
    LocalDateTime answeredAt
) {
    public static QcItemResponse from(QcChecklistItem item, QcResponse response) {
        return new QcItemResponse(
            item.getId(),
            item.getLabel(),
            item.getCategory(),
            item.getSortOrder(),
            response != null && response.isChecked(),
            response != null ? response.getNote() : null,
            (response != null && response.getAnsweredBy() != null) ? response.getAnsweredBy().getFullName() : null,
            response != null ? response.getAnsweredAt() : null
        );
    }
}
