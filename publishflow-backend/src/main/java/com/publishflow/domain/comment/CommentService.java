package com.publishflow.domain.comment;

import com.publishflow.common.exception.BusinessRuleException;
import com.publishflow.common.exception.ResourceNotFoundException;
import com.publishflow.domain.comment.dto.CommentResponse;
import com.publishflow.domain.comment.dto.CreateCommentRequest;
import com.publishflow.domain.project.Project;
import com.publishflow.domain.project.ProjectRepository;
import com.publishflow.domain.user.User;
import com.publishflow.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<CommentResponse> getByProject(String projectId) {
        return commentRepository.findTopLevelByProjectId(projectId)
            .stream().map(this::toResponse).toList();
    }

    @Transactional
    public CommentResponse create(String projectId, CreateCommentRequest request, String authorId) {
        Project project = projectRepository.findByIdAndDeletedAtIsNull(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        User author = userRepository.findByIdAndDeletedAtIsNull(authorId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId));

        Comment parent = null;
        if (request.parentId() != null) {
            parent = commentRepository.findByIdAndDeletedAtIsNull(request.parentId())
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", request.parentId()));
            if (parent.getParent() != null) {
                throw new BusinessRuleException("Replies cannot be nested more than one level");
            }
        }

        Comment comment = Comment.builder()
            .project(project)
            .author(author)
            .content(request.content())
            .parent(parent)
            .build();

        return toResponse(commentRepository.save(comment));
    }

    @Transactional
    public void delete(String commentId, String requesterId) {
        Comment comment = commentRepository.findByIdAndDeletedAtIsNull(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        if (!comment.getAuthor().getId().equals(requesterId)) {
            throw new BusinessRuleException("You can only delete your own comments");
        }
        comment.softDelete();
        commentRepository.save(comment);
    }

    private CommentResponse toResponse(Comment c) {
        List<CommentResponse> replies = c.getReplies().stream()
            .filter(r -> r.getDeletedAt() == null)
            .map(this::toResponse)
            .toList();
        return new CommentResponse(
            c.getId(),
            c.getProject().getId(),
            c.getAuthor().getId(),
            c.getAuthor().getFullName(),
            null,
            c.getContent(),
            c.getParent() != null ? c.getParent().getId() : null,
            replies,
            c.getCreatedAt(),
            c.getUpdatedAt()
        );
    }
}
