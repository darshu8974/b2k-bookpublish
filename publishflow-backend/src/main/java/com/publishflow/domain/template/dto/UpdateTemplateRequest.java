package com.publishflow.domain.template.dto;

import java.util.List;

public record UpdateTemplateRequest(
    String name,
    String type,
    String content,
    List<String> tags
) {}
