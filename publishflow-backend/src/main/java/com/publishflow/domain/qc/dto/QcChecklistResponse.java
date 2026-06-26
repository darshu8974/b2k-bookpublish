package com.publishflow.domain.qc.dto;

import java.util.List;

public record QcChecklistResponse(
    String projectId,
    int totalItems,
    int checkedItems,
    List<QcItemResponse> items
) {}
