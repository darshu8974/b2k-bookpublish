package com.publishflow.domain.user;

import com.publishflow.common.exception.BusinessRuleException;
import com.publishflow.common.exception.ResourceNotFoundException;
import com.publishflow.common.response.PagedResponse;
import com.publishflow.domain.user.dto.CreateUserRequest;
import com.publishflow.domain.user.dto.UpdateUserRequest;
import com.publishflow.domain.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> getAll(String search, UserRole role, int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        var pageResult = userRepository.findAllFiltered(search, role, pageable);
        return PagedResponse.from(pageResult.map(UserResponse::from));
    }

    @Transactional(readOnly = true)
    public UserResponse getById(String id) {
        return UserResponse.from(findActiveById(id));
    }

    @Transactional
    public UserResponse create(CreateUserRequest request) {
        if (userRepository.existsByEmailAndDeletedAtIsNull(request.getEmail())) {
            throw new BusinessRuleException("A user with email '" + request.getEmail() + "' already exists.");
        }
        User user = User.builder()
            .email(request.getEmail().toLowerCase().trim())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .fullName(request.getFullName().trim())
            .role(request.getRole())
            .active(true)
            .build();
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse update(String id, UpdateUserRequest request) {
        User user = findActiveById(id);
        if (request.fullName() != null) user.setFullName(request.fullName().trim());
        if (request.email() != null) {
            String newEmail = request.email().toLowerCase().trim();
            userRepository.findByEmailAndDeletedAtIsNull(newEmail)
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> { throw new BusinessRuleException("Email '" + newEmail + "' is already in use."); });
            user.setEmail(newEmail);
        }
        if (request.role() != null) user.setRole(request.role());
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateStatus(String id, boolean active) {
        User user = findActiveById(id);
        user.setActive(active);
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public void delete(String id) {
        User user = findActiveById(id);
        user.softDelete();
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User findActiveById(String id) {
        return userRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }
}
