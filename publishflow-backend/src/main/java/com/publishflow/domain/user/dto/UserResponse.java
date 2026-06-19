package com.publishflow.domain.user.dto;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.publishflow.domain.user.User;
import com.publishflow.domain.user.UserRole;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserResponse {

    private String id;
    private String email;
    private String fullName;
    private UserRole role;

    // Suppress Lombok's auto-generated isActive() so our @JsonGetter below controls the JSON key.
    @Getter(AccessLevel.NONE)
    private boolean active;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @JsonGetter("isActive")
    public boolean isActive() {
        return active;
    }

    public static UserResponse from(User user) {
        return UserResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .role(user.getRole())
            .active(user.isActive())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .build();
    }
}
