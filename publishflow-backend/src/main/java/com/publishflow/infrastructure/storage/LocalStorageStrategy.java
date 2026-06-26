package com.publishflow.infrastructure.storage;

import com.publishflow.common.exception.BusinessRuleException;
import com.publishflow.config.StorageProperties;
import com.publishflow.domain.file.StorageStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Component
@Profile("!s3")
@RequiredArgsConstructor
public class LocalStorageStrategy implements StorageStrategy {

    private final StorageProperties storageProperties;

    @Override
    public String store(MultipartFile file, String filename) {
        try {
            Path uploadDir = Paths.get(storageProperties.getLocal().getUploadDir()).toAbsolutePath().normalize();
            Files.createDirectories(uploadDir);
            Path target = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return target.toString();
        } catch (IOException e) {
            throw new BusinessRuleException("Failed to store file: " + e.getMessage());
        }
    }

    @Override
    public String store(byte[] content, String filename) {
        try {
            Path uploadDir = Paths.get(storageProperties.getLocal().getUploadDir()).toAbsolutePath().normalize();
            Files.createDirectories(uploadDir);
            Path target = uploadDir.resolve(filename);
            Files.write(target, content);
            return target.toString();
        } catch (IOException e) {
            throw new BusinessRuleException("Failed to store file: " + e.getMessage());
        }
    }

    @Override
    public byte[] retrieve(String storagePath) {
        try {
            return Files.readAllBytes(Paths.get(storagePath));
        } catch (IOException e) {
            throw new BusinessRuleException("File not found: " + storagePath);
        }
    }

    @Override
    public void delete(String storagePath) {
        try {
            Files.deleteIfExists(Paths.get(storagePath));
        } catch (IOException e) {
            throw new BusinessRuleException("Failed to delete file: " + e.getMessage());
        }
    }
}
