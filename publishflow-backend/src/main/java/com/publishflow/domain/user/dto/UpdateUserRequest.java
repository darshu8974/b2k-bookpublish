package com.publishflow.domain.user.dto;

import com.publishflow.domain.user.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
    @Size(max = 200) String fullName,
    @Email @Size(max = 255) String email,
    UserRole role
) {}
