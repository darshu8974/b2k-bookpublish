package com.publishflow.domain.workflow;

import com.publishflow.common.exception.BusinessRuleException;
import com.publishflow.common.exception.ResourceNotFoundException;
import com.publishflow.domain.project.Project;
import com.publishflow.domain.project.ProjectRepository;
import com.publishflow.domain.project.ProjectStatus;
import com.publishflow.domain.user.User;
import com.publishflow.domain.user.UserRepository;
import com.publishflow.domain.workflow.dto.WorkflowStageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkflowService {

    private final WorkflowStageRepository workflowStageRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    private static final WorkflowStageName[] STAGE_ORDER = WorkflowStageName.values();

    /**
     * Called inside ProjectService.create() which is already @Transactional.
     * Stages are added to the project's managed collection — no explicit save needed.
     */
    @Transactional
    public void initializeWorkflow(Project project) {
        WorkflowStageName[] stages = WorkflowStageName.values();
        for (int i = 0; i < stages.length; i++) {
            WorkflowStage stage = WorkflowStage.builder()
                .project(project)
                .stageName(stages[i])
                .stageOrder(i + 1)
                .status(i == 0 ? WorkflowStageStatus.IN_PROGRESS : WorkflowStageStatus.PENDING)
                .build();
            if (i == 0) {
                stage.setStartedAt(LocalDateTime.now());
            }
            project.getStages().add(stage);
        }
    }

    @Transactional(readOnly = true)
    public List<WorkflowStageResponse> getStages(String projectId) {
        return workflowStageRepository.findActiveByProjectId(projectId)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    /**
     * Loads the project within this transaction so dirty-checking persists
     * the currentStage / status changes automatically on commit.
     */
    @Transactional
    public WorkflowStageResponse advanceStage(String projectId, String stageNameStr, String remarks) {
        Project project = getProjectOrThrow(projectId);
        WorkflowStageName stageName = parseStageName(stageNameStr);
        WorkflowStage stage = getStageOrThrow(projectId, stageName);

        if (stage.getStatus() != WorkflowStageStatus.IN_PROGRESS) {
            throw new BusinessRuleException("Stage " + stageName + " is not currently in progress");
        }

        stage.setStatus(WorkflowStageStatus.COMPLETED);
        stage.setCompletedAt(LocalDateTime.now());
        if (remarks != null) stage.setRemarks(remarks);

        WorkflowStageName nextStageName = getNextStage(stageName);
        if (nextStageName != null) {
            WorkflowStage next = getStageOrThrow(projectId, nextStageName);
            next.setStatus(WorkflowStageStatus.IN_PROGRESS);
            next.setStartedAt(LocalDateTime.now());
            project.setCurrentStage(nextStageName);
            workflowStageRepository.save(next);
        } else {
            // All stages done — mark the project complete
            project.setCurrentStage(stageName);
            project.setStatus(ProjectStatus.COMPLETED);
            project.setCompletedAt(LocalDateTime.now());
        }

        return toResponse(workflowStageRepository.save(stage));
    }

    /**
     * Rejects the currently in-progress stage and re-opens the previous one.
     */
    @Transactional
    public WorkflowStageResponse rejectStage(String projectId, String reason) {
        Project project = getProjectOrThrow(projectId);
        WorkflowStageName stageName = project.getCurrentStage();
        WorkflowStage stage = getStageOrThrow(projectId, stageName);

        if (stage.getStatus() != WorkflowStageStatus.IN_PROGRESS) {
            throw new BusinessRuleException("Only the current in-progress stage can be rejected");
        }

        stage.setStatus(WorkflowStageStatus.REJECTED);
        stage.setRemarks(reason);
        stage.setCompletedAt(LocalDateTime.now());

        WorkflowStageName prevStageName = getPreviousStage(stageName);
        if (prevStageName != null) {
            WorkflowStage prev = getStageOrThrow(projectId, prevStageName);
            prev.setStatus(WorkflowStageStatus.IN_PROGRESS);
            prev.setStartedAt(LocalDateTime.now());
            prev.setCompletedAt(null);
            project.setCurrentStage(prevStageName);
            workflowStageRepository.save(prev);
        }

        return toResponse(workflowStageRepository.save(stage));
    }

    @Transactional
    public WorkflowStageResponse assignStage(String projectId, String stageNameStr, String userId) {
        getProjectOrThrow(projectId);
        WorkflowStageName stageName = parseStageName(stageNameStr);
        WorkflowStage stage = getStageOrThrow(projectId, stageName);
        User user = userRepository.findByIdAndDeletedAtIsNull(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        stage.setAssignedTo(user);
        return toResponse(workflowStageRepository.save(stage));
    }

    private Project getProjectOrThrow(String projectId) {
        return projectRepository.findByIdAndDeletedAtIsNull(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
    }

    private WorkflowStage getStageOrThrow(String projectId, WorkflowStageName stageName) {
        return workflowStageRepository.findByProjectIdAndStageName(projectId, stageName)
            .orElseThrow(() -> new ResourceNotFoundException("WorkflowStage", "stageName", stageName.name()));
    }

    private WorkflowStageName parseStageName(String name) {
        try {
            return WorkflowStageName.valueOf(name.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessRuleException("Invalid stage name: " + name);
        }
    }

    private WorkflowStageName getNextStage(WorkflowStageName current) {
        int idx = current.ordinal();
        return idx + 1 < STAGE_ORDER.length ? STAGE_ORDER[idx + 1] : null;
    }

    private WorkflowStageName getPreviousStage(WorkflowStageName current) {
        int idx = current.ordinal();
        return idx > 0 ? STAGE_ORDER[idx - 1] : null;
    }

    public WorkflowStageResponse toResponse(WorkflowStage s) {
        return new WorkflowStageResponse(
            s.getId(),
            s.getStageName(),
            s.getStageOrder(),
            s.getStatus(),
            s.getAssignedTo() != null ? s.getAssignedTo().getId() : null,
            s.getAssignedTo() != null ? s.getAssignedTo().getFullName() : null,
            s.getRemarks(),
            s.getStartedAt(),
            s.getCompletedAt(),
            s.getCreatedAt()
        );
    }
}
