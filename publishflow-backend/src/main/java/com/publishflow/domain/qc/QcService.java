package com.publishflow.domain.qc;

import com.publishflow.common.exception.ResourceNotFoundException;
import com.publishflow.domain.audit.AuditAction;
import com.publishflow.domain.audit.AuditService;
import com.publishflow.domain.project.Project;
import com.publishflow.domain.project.ProjectRepository;
import com.publishflow.domain.qc.dto.QcChecklistResponse;
import com.publishflow.domain.qc.dto.QcItemResponse;
import com.publishflow.domain.qc.dto.SubmitQcRequest;
import com.publishflow.domain.user.User;
import com.publishflow.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QcService {

    private final QcChecklistItemRepository itemRepository;
    private final QcResponseRepository responseRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public QcChecklistResponse getChecklist(String projectId) {
        projectRepository.findByIdAndDeletedAtIsNull(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        List<QcChecklistItem> items = itemRepository.findByActiveTrueOrderBySortOrderAsc();
        List<QcResponse> responses = responseRepository.findByProjectId(projectId);

        Map<String, QcResponse> responseByItemId = responses.stream()
            .collect(Collectors.toMap(r -> r.getItem().getId(), Function.identity()));

        List<QcItemResponse> itemResponses = items.stream()
            .map(item -> QcItemResponse.from(item, responseByItemId.get(item.getId())))
            .toList();

        int checked = (int) itemResponses.stream().filter(QcItemResponse::checked).count();

        return new QcChecklistResponse(projectId, items.size(), checked, itemResponses);
    }

    @Transactional
    public QcChecklistResponse submit(String projectId, SubmitQcRequest request, String userId) {
        Project project = projectRepository.findByIdAndDeletedAtIsNull(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        User user = userRepository.findByIdAndDeletedAtIsNull(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        for (SubmitQcRequest.QcItemSubmit submit : request.responses()) {
            QcChecklistItem item = itemRepository.findById(submit.itemId())
                .orElseThrow(() -> new ResourceNotFoundException("QcChecklistItem", "id", submit.itemId()));

            QcResponse response = responseRepository
                .findByProjectAndItem(projectId, submit.itemId())
                .orElse(QcResponse.builder().project(project).item(item).build());

            response.setChecked(submit.checked());
            response.setNote(submit.note());
            response.setAnsweredBy(user);
            response.setAnsweredAt(LocalDateTime.now());
            responseRepository.save(response);
        }

        auditService.log(userId, user.getFullName(), AuditAction.QC_SUBMITTED,
            "Project", projectId, "QC checklist submitted");

        return getChecklist(projectId);
    }
}
