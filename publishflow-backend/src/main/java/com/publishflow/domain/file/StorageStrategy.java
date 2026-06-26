package com.publishflow.domain.file;

import org.springframework.web.multipart.MultipartFile;

public interface StorageStrategy {
    String store(MultipartFile file, String filename);
    String store(byte[] content, String filename);
    byte[] retrieve(String storagePath);
    void delete(String storagePath);
}
