package com.publishflow.domain.qc.dto;

import java.util.List;

public record SubmitQcRequest(List<QcItemSubmit> responses) {
    public record QcItemSubmit(String itemId, boolean checked, String note) {}
}
