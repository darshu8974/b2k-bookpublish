package com.publishflow.domain.template;

import com.publishflow.common.exception.ResourceNotFoundException;
import com.publishflow.common.response.PagedResponse;
import com.publishflow.domain.audit.AuditAction;
import com.publishflow.domain.audit.AuditService;
import com.publishflow.domain.template.dto.CreateTemplateRequest;
import com.publishflow.domain.template.dto.TemplateResponse;
import com.publishflow.domain.template.dto.UpdateTemplateRequest;
import com.publishflow.domain.user.User;
import com.publishflow.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TemplateService {

    private final TemplateRepository templateRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public PagedResponse<TemplateResponse> getAll(String type, String search, int page, int size) {
        String s = (search == null || search.isBlank()) ? "" : search.trim();
        String t = (type == null || type.isBlank()) ? "" : type.trim().toUpperCase();
        var pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());
        return PagedResponse.from(templateRepository.findAllActive(t, s, pageable).map(TemplateResponse::from));
    }

    @Transactional(readOnly = true)
    public TemplateResponse getById(String id) {
        return TemplateResponse.from(findActive(id));
    }

    @Transactional
    public TemplateResponse create(CreateTemplateRequest request, String userId) {
        User creator = userRepository.findByIdAndDeletedAtIsNull(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Template template = Template.builder()
            .name(request.name().trim())
            .type(request.type() != null ? request.type().toUpperCase() : "EMAIL")
            .content(request.content())
            .tags(request.tags() != null ? String.join(",", request.tags()) : null)
            .createdBy(creator)
            .build();

        Template saved = templateRepository.save(template);
        auditService.log(userId, creator.getFullName(), AuditAction.TEMPLATE_CREATED,
            "Template", saved.getId(), "Created template: " + saved.getName());
        return TemplateResponse.from(saved);
    }

    @Transactional
    public TemplateResponse update(String id, UpdateTemplateRequest request, String userId) {
        Template template = findActive(id);
        User user = userRepository.findByIdAndDeletedAtIsNull(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (request.name() != null) template.setName(request.name().trim());
        if (request.type() != null) template.setType(request.type().toUpperCase());
        if (request.content() != null) template.setContent(request.content());
        if (request.tags() != null) template.setTags(String.join(",", request.tags()));

        Template saved = templateRepository.save(template);
        auditService.log(userId, user.getFullName(), AuditAction.TEMPLATE_UPDATED,
            "Template", saved.getId(), "Updated template: " + saved.getName());
        return TemplateResponse.from(saved);
    }

    @Transactional
    public void delete(String id, String userId) {
        Template template = findActive(id);
        User user = userRepository.findByIdAndDeletedAtIsNull(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        template.softDelete();
        templateRepository.save(template);
        auditService.log(userId, user.getFullName(), AuditAction.TEMPLATE_DELETED,
            "Template", id, "Deleted template: " + template.getName());
    }

    private Template findActive(String id) {
        return templateRepository.findById(id)
            .filter(t -> t.getDeletedAt() == null)
            .orElseThrow(() -> new ResourceNotFoundException("Template", "id", id));
    }
}
