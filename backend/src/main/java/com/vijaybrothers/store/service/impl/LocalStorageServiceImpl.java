package com.vijaybrothers.store.service.impl;

import com.vijaybrothers.store.service.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Primary;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Primary
public class LocalStorageServiceImpl implements StorageService {

    private final Path rootLocation = Paths.get("../frontend/public/uploads");

    @Override
    public String store(MultipartFile file, String subfolder, String productName) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file.");
            }
            Path subfolderPath = rootLocation.resolve(subfolder);
            if (!Files.exists(subfolderPath)) {
                Files.createDirectories(subfolderPath);
            }
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            int i = originalFilename.lastIndexOf('.');
            if (i > 0) {
                extension = originalFilename.substring(i);
            }
            // Sanitize product name for filename
            String sanitizedProductName = productName.replaceAll("[^a-zA-Z0-9\\s-]", "").replaceAll("\\s+", "-").toLowerCase();
            String newFilename = sanitizedProductName + "-" + UUID.randomUUID().toString() + extension;
            Path destinationFile = subfolderPath.resolve(newFilename).normalize().toAbsolutePath();

            try (var inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile);
            }
            return "/uploads/" + subfolder + "/" + newFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }

    public byte[] downloadFile(String fileName) {
        try {
            Path file = rootLocation.resolve(fileName);
            return Files.readAllBytes(file);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file: " + fileName, e);
        }
    }

    public String getFileUrl(String fileName) {
        return "/uploads/" + fileName;
    }

    @Override
    public void deleteFile(String fileName) {
        try {
            Path file = Paths.get("../frontend/public" + fileName);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + fileName, e);
        }
    }
}
