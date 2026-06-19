package com.publishflow.domain.audit.dto;

import java.time.LocalDateTime;

public record ActivityEventResponse(
    String id,
    String type,
    String actorId,
    String actorName,
    String description,
    LocalDateTime timestamp
) {}
