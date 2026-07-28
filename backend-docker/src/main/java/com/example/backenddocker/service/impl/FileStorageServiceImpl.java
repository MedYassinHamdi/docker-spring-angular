package com.example.backenddocker.service.impl;

import com.example.backenddocker.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public String storeFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
            String storedFilename = UUID.randomUUID() + extension;

            Path targetLocation = uploadPath.resolve(storedFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return storedFilename;
        } catch (IOException e) {
            throw new RuntimeException("Could not store file: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteFile(String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Could not delete file: " + e.getMessage(), e);
        }
    }
}