package com.publishflow.domain.file;

import com.publishflow.common.exception.BusinessRuleException;
import com.publishflow.common.exception.ResourceNotFoundException;
import com.publishflow.domain.file.dto.FileUploadResponse;
import com.publishflow.domain.project.Project;
import com.publishflow.domain.project.ProjectRepository;
import com.publishflow.domain.user.User;
import com.publishflow.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private static final long MAX_FILE_SIZE = 50L * 1024 * 1024;

    private final FileUploadRepository fileUploadRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final StorageStrategy storageStrategy;

    public List<FileUploadResponse> getByProject(String projectId) {
        return fileUploadRepository.findByProjectId(projectId)
            .stream().map(this::toResponse).toList();
    }

    public FileUploadResponse getById(String fileId) {
        return toResponse(fileUploadRepository.findByIdAndDeletedAtIsNull(fileId)
            .orElseThrow(() -> new ResourceNotFoundException("FileUpload", "id", fileId)));
    }

    @Transactional
    public FileUploadResponse upload(String projectId, MultipartFile file, String categoryStr, String uploaderId) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessRuleException("File exceeds maximum size of 50 MB");
        }

        Project project = projectRepository.findByIdAndDeletedAtIsNull(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        User uploader = userRepository.findByIdAndDeletedAtIsNull(uploaderId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", uploaderId));

        UploadCategory category = UploadCategory.valueOf(categoryStr.toUpperCase());
        String storedFilename = UUID.randomUUID() + "_" + sanitize(file.getOriginalFilename());
        String storagePath = storageStrategy.store(file, storedFilename);

        FileUpload upload = FileUpload.builder()
            .project(project)
            .uploadedBy(uploader)
            .originalFilename(file.getOriginalFilename())
            .storedFilename(storedFilename)
            .fileSize(file.getSize())
            .contentType(file.getContentType())
            .category(category)
            .storagePath(storagePath)
            .build();

        return toResponse(fileUploadRepository.save(upload));
    }

    @Transactional
    public void delete(String fileId, String requesterId) {
        FileUpload upload = fileUploadRepository.findByIdAndDeletedAtIsNull(fileId)
            .orElseThrow(() -> new ResourceNotFoundException("FileUpload", "id", fileId));

        User requester = userRepository.findByIdAndDeletedAtIsNull(requesterId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", requesterId));

        boolean isOwner = upload.getUploadedBy().getId().equals(requesterId);
        boolean isAdmin = requester.getRole() == com.publishflow.domain.user.UserRole.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new BusinessRuleException("You do not have permission to delete this file");
        }

        storageStrategy.delete(upload.getStoragePath());
        upload.softDelete();
        fileUploadRepository.save(upload);
    }

    public byte[] download(String fileId) {
        FileUpload upload = fileUploadRepository.findByIdAndDeletedAtIsNull(fileId)
            .orElseThrow(() -> new ResourceNotFoundException("FileUpload", "id", fileId));
        return storageStrategy.retrieve(upload.getStoragePath());
    }

    private String sanitize(String filename) {
        if (filename == null) return "file";
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private FileUploadResponse toResponse(FileUpload f) {
        return new FileUploadResponse(
            f.getId(),
            f.getProject().getId(),
            f.getOriginalFilename(),
            f.getFileSize(),
            f.getContentType(),
            f.getCategory(),
            f.getUploadedBy().getId(),
            f.getUploadedBy().getFullName(),
            f.getCreatedAt()
        );
    }
}
