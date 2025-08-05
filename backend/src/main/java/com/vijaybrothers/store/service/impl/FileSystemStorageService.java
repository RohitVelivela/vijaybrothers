package com.vijaybrothers.store.service.impl;

import com.vijaybrothers.store.service.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileSystemStorageService implements StorageService {

    private final java.nio.file.Path rootLocation;

    public FileSystemStorageService() {
        this.rootLocation = Paths.get(System.getProperty("user.home"), "uploads");
    }

    @Override
    public String store(MultipartFile file, String subfolder, String productName) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file.");
            }
            java.nio.file.Path subfolderPath = this.rootLocation.resolve(subfolder);
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
            java.nio.file.Path destinationFile = subfolderPath.resolve(newFilename)
                    .normalize().toAbsolutePath();
            if (!destinationFile.getParent().equals(subfolderPath.toAbsolutePath())) {
                // This is a security check
                throw new RuntimeException(
                        "Cannot store file outside current directory.");
            }
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile,
                    StandardCopyOption.REPLACE_EXISTING);
            }
            return "/uploads/" + subfolder + "/" + newFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }

    @Override
    public void deleteFile(String fileName) {
        try {
            java.nio.file.Path file = this.rootLocation.resolve(fileName);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + fileName, e);
        }
    }

    @Override
    public void deleteProductImage(String imageUrl) {
        try {
            // Assuming imageUrl is in the format "/uploads/images/some-image.jpg"
            String filePath = imageUrl.substring("/uploads/".length());
            java.nio.file.Path file = this.rootLocation.resolve(filePath);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete product image: " + imageUrl, e);
        }
    }

    @Override
    public String storeProductImage(MultipartFile file, String productName) {
        return store(file, "images", productName);
    }

}