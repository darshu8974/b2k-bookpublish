package com.publishflow.domain.auth.dto;

import com.publishflow.domain.user.UserRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private long expiresIn;
    private UserInfo user;

    @Getter
    @Builder
    public static class UserInfo {
        private String id;
        private String email;
        private String fullName;
        private UserRole role;
    }
}
