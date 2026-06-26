package com.publishflow.domain.template.dto;

import com.publishflow.domain.template.Template;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

public record TemplateResponse(
    String id,
    String name,
    String type,
    String content,
    List<String> tags,
    String createdBy,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static TemplateResponse from(Template t) {
        List<String> tagList = (t.getTags() != null && !t.getTags().isBlank())
            ? Arrays.stream(t.getTags().split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList()
            : List.of();
        return new TemplateResponse(
            t.getId(),
            t.getName(),
            t.getType(),
            t.getContent(),
            tagList,
            t.getCreatedBy() != null ? t.getCreatedBy().getFullName() : null,
            t.getCreatedAt(),
            t.getUpdatedAt()
        );
    }
}
