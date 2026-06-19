package com.publishflow.domain.auth;

import com.publishflow.common.exception.BusinessRuleException;
import com.publishflow.common.exception.ResourceNotFoundException;
import com.publishflow.config.JwtProperties;
import com.publishflow.domain.auth.dto.LoginRequest;
import com.publishflow.domain.auth.dto.LoginResponse;
import com.publishflow.domain.user.User;
import com.publishflow.domain.user.UserRepository;
import com.publishflow.domain.user.dto.UserResponse;
import com.publishflow.security.JwtTokenProvider;
import com.publishflow.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtProperties jwtProperties;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findByIdAndDeletedAtIsNull(principal.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        String accessToken = tokenProvider.generateAccessToken(principal);
        String rawRefreshToken = UUID.randomUUID().toString();
        String tokenHash = hashToken(rawRefreshToken);

        RefreshToken refreshToken = RefreshToken.builder()
            .user(user)
            .tokenHash(tokenHash)
            .expiresAt(LocalDateTime.now().plusSeconds(jwtProperties.getRefreshTokenExpirationMs() / 1000))
            .build();
        refreshTokenRepository.save(refreshToken);

        return LoginResponse.builder()
            .accessToken(accessToken)
            .refreshToken(rawRefreshToken)
            .tokenType("Bearer")
            .expiresIn(jwtProperties.getAccessTokenExpirationMs() / 1000)
            .user(LoginResponse.UserInfo.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build())
            .build();
    }

    @Transactional
    public LoginResponse refresh(String rawRefreshToken) {
        String tokenHash = hashToken(rawRefreshToken);
        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(tokenHash)
            .orElseThrow(() -> new BusinessRuleException("Refresh token is invalid or has been revoked."));

        if (!storedToken.isValid()) {
            throw new BusinessRuleException("Refresh token has expired or been revoked. Please log in again.");
        }

        storedToken.revoke();
        refreshTokenRepository.save(storedToken);

        User user = storedToken.getUser();
        String newAccessToken = tokenProvider.generateAccessTokenFromUserId(
            user.getId(), user.getRole().name(), user.getEmail(), user.getFullName()
        );
        String newRawRefreshToken = UUID.randomUUID().toString();
        String newTokenHash = hashToken(newRawRefreshToken);

        RefreshToken newRefreshToken = RefreshToken.builder()
            .user(user)
            .tokenHash(newTokenHash)
            .expiresAt(LocalDateTime.now().plusSeconds(jwtProperties.getRefreshTokenExpirationMs() / 1000))
            .build();
        refreshTokenRepository.save(newRefreshToken);

        return LoginResponse.builder()
            .accessToken(newAccessToken)
            .refreshToken(newRawRefreshToken)
            .tokenType("Bearer")
            .expiresIn(jwtProperties.getAccessTokenExpirationMs() / 1000)
            .user(LoginResponse.UserInfo.builder()
                .id(user.getId()).email(user.getEmail())
                .fullName(user.getFullName()).role(user.getRole())
                .build())
            .build();
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        String tokenHash = hashToken(rawRefreshToken);
        refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(t -> {
            t.revoke();
            refreshTokenRepository.save(t);
        });
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(hash.length * 2);
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 unavailable", e);
        }
    }

    @Transactional(readOnly = true)
    public UserResponse getMe(String userId) {
        User user = userRepository.findByIdAndDeletedAtIsNull(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return UserResponse.from(user);
    }
}
