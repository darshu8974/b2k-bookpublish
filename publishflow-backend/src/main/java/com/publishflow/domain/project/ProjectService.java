package com.publishflow.domain.project;

import com.publishflow.common.exception.ResourceNotFoundException;
import com.publishflow.common.response.PagedResponse;
import com.publishflow.domain.customer.Customer;
import com.publishflow.domain.customer.CustomerRepository;
import com.publishflow.domain.project.dto.*;
import com.publishflow.domain.user.User;
import com.publishflow.domain.user.UserRepository;
import com.publishflow.domain.workflow.WorkflowService;
import com.publishflow.domain.workflow.WorkflowStageName;
import com.publishflow.domain.workflow.dto.WorkflowStageResponse;
import com.publishflow.common.util.ProjectCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final WorkflowService workflowService;
    private final ProjectCodeGenerator projectCodeGenerator;

    @Transactional(readOnly = true)
    public PagedResponse<ProjectSummaryResponse> getAll(
        String statusStr, String priorityStr, String stageStr, String search, int page, int size
    ) {
        ProjectStatus status = statusStr != null ? ProjectStatus.valueOf(statusStr.toUpperCase()) : null;
        ProjectPriority priority = priorityStr != null ? ProjectPriority.valueOf(priorityStr.toUpperCase()) : null;
        WorkflowStageName stage = stageStr != null ? WorkflowStageName.valueOf(stageStr.toUpperCase()) : null;

        String s = (search == null || search.isBlank()) ? "" : search.trim();
        Page<Project> result = projectRepository.findAllFiltered(
            status, priority, stage, s,
            PageRequest.of(page, size, Sort.by("createdAt").descending())
        );

        return PagedResponse.of(result, this::toSummary);
    }

    @Transactional(readOnly = true)
    public ProjectDetailResponse getById(String id) {
        Project project = projectRepository.findByIdWithStages(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return toDetail(project);
    }

    @Transactional
    public ProjectDetailResponse create(CreateProjectRequest request, String creatorId) {
        Customer customer = customerRepository.findByIdAndDeletedAtIsNull(request.customerId())
            .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", request.customerId()));

        User creator = userRepository.findByIdAndDeletedAtIsNull(creatorId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", creatorId));

        User manager = null;
        if (request.projectManagerId() != null) {
            manager = userRepository.findByIdAndDeletedAtIsNull(request.projectManagerId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.projectManagerId()));
        }

        String projectCode = projectCodeGenerator.generate();

        Project project = Project.builder()
            .projectCode(projectCode)
            .title(request.title())
            .description(request.description())
            .customer(customer)
            .projectManager(manager)
            .createdBy(creator)
            .priority(request.priority())
            .dueDate(request.dueDate())
            .startedAt(LocalDateTime.now())
            .build();

        workflowService.initializeWorkflow(project);
        Project saved = projectRepository.save(project);
        return toDetail(saved);
    }

    @Transactional
    public ProjectDetailResponse update(String id, UpdateProjectRequest request) {
        Project project = projectRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        if (request.title() != null) project.setTitle(request.title());
        if (request.description() != null) project.setDescription(request.description());
        if (request.priority() != null) project.setPriority(request.priority());
        if (request.status() != null) project.setStatus(request.status());
        if (request.dueDate() != null) project.setDueDate(request.dueDate());
        if (request.projectManagerId() != null) {
            User manager = userRepository.findByIdAndDeletedAtIsNull(request.projectManagerId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.projectManagerId()));
            project.setProjectManager(manager);
        }

        return toDetail(projectRepository.save(project));
    }

    @Transactional
    public ProjectDetailResponse updateStatus(String id, String statusStr) {
        Project project = projectRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        project.setStatus(ProjectStatus.valueOf(statusStr.toUpperCase()));
        return toDetail(projectRepository.save(project));
    }

    @Transactional
    public void delete(String id) {
        Project project = projectRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        project.softDelete();
        projectRepository.save(project);
    }

    private ProjectSummaryResponse toSummary(Project p) {
        long completed = p.getStages().stream()
            .filter(s -> s.getStatus().name().equals("COMPLETED"))
            .count();
        return new ProjectSummaryResponse(
            p.getId(),
            p.getProjectCode(),
            p.getTitle(),
            p.getCustomer() != null ? p.getCustomer().getName() : null,
            p.getProjectManager() != null ? p.getProjectManager().getFullName() : null,
            p.getCurrentStage(),
            p.getStatus(),
            p.getPriority(),
            p.getDueDate(),
            p.getCreatedAt(),
            p.getUpdatedAt(),
            (int) completed,
            8
        );
    }

    private ProjectDetailResponse toDetail(Project p) {
        List<WorkflowStageResponse> stages = p.getStages().stream()
            .map(workflowService::toResponse)
            .toList();
        return new ProjectDetailResponse(
            p.getId(),
            p.getProjectCode(),
            p.getTitle(),
            p.getDescription(),
            p.getCustomer() != null ? p.getCustomer().getId() : null,
            p.getCustomer() != null ? p.getCustomer().getName() : null,
            p.getProjectManager() != null ? p.getProjectManager().getId() : null,
            p.getProjectManager() != null ? p.getProjectManager().getFullName() : null,
            p.getCreatedBy() != null ? p.getCreatedBy().getId() : null,
            p.getCreatedBy() != null ? p.getCreatedBy().getFullName() : null,
            p.getCurrentStage(),
            p.getStatus(),
            p.getPriority(),
            p.getDueDate(),
            p.getStartedAt(),
            p.getCompletedAt(),
            p.getCreatedAt(),
            p.getUpdatedAt(),
            stages
        );
    }
}
