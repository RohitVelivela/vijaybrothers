package com.vijaybrothers.store.service.impl;

import com.vijaybrothers.store.service.StorageService;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Primary;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Primary
public class LocalStorageServiceImpl implements StorageService {

    private final Path rootLocation = Paths.get("C:/Users/rohit/Documents/Personal/vijaybrothers/frontend/public/uploads");
    private final Path productImagesLocation;
    private final Path productThumbnailsLocation;

    public LocalStorageServiceImpl() throws IOException {
        this.productImagesLocation = this.rootLocation.resolve("products");
        this.productThumbnailsLocation = this.rootLocation.resolve("products/thumbnails");
        Files.createDirectories(this.productImagesLocation);
        Files.createDirectories(this.productThumbnailsLocation);
    }

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
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }
            return "/uploads/" + subfolder + "/" + newFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }

    @Override
    public String storeProductImage(MultipartFile file, String productName) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty product image.");
            }

            BufferedImage originalImage = ImageIO.read(file.getInputStream());
            String originalFilename = file.getOriginalFilename();
            String extension = getFileExtension(originalFilename).toLowerCase();

            // Determine output format (prefer WebP, then JPEG, then PNG)
            String outputFormat = "webp";
            if (!ImageIO.getImageWritersByFormatName("webp").hasNext()) {
                if (extension.equals("jpeg") || extension.equals("jpg")) {
                    outputFormat = "jpeg";
                } else if (extension.equals("png")) {
                    outputFormat = "png";
                }
            } else {
                outputFormat = "jpeg"; // Fallback
            }

            String sanitizedProductName = productName.replaceAll("[^a-zA-Z0-9\\s-]", "").replaceAll("\\s+", "-").toLowerCase();
            String baseFilename = sanitizedProductName + "-" + UUID.randomUUID().toString();

            // Store Main Product Image (800x1200px, max 1MB)
            String mainImageFilename = baseFilename + "." + outputFormat;
            Path mainImagePath = productImagesLocation.resolve(mainImageFilename);
            float mainImageQuality = 0.8f;
            byte[] mainImageBytes;
            do {
                try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
                    Thumbnails.of(originalImage)
                            .size(800, 1200)
                            .outputFormat(outputFormat)
                            .outputQuality(mainImageQuality)
                            .toOutputStream(os);
                    mainImageBytes = os.toByteArray();
                }
                if (mainImageBytes.length > 1024 * 1024 && mainImageQuality > 0.1f) { // Don't go below 10% quality
                    mainImageQuality -= 0.05f;
                } else {
                    break;
                }
            } while (true);
            Files.copy(new ByteArrayInputStream(mainImageBytes), mainImagePath, StandardCopyOption.REPLACE_EXISTING);


            // Store Thumbnail Image (400x400px, max 300KB)
            String thumbnailFilename = baseFilename + "_thumb." + outputFormat;
            Path thumbnailPath = productThumbnailsLocation.resolve(thumbnailFilename);
            float thumbnailQuality = 0.8f;
            byte[] thumbnailBytes;
            do {
                try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
                    Thumbnails.of(originalImage)
                            .size(400, 400)
                            .outputFormat(outputFormat)
                            .outputQuality(thumbnailQuality)
                            .toOutputStream(os);
                    thumbnailBytes = os.toByteArray();
                }
                if (thumbnailBytes.length > 300 * 1024 && thumbnailQuality > 0.1f) { // Don't go below 10% quality
                    thumbnailQuality -= 0.05f;
                } else {
                    break;
                }
            } while (true);
            Files.copy(new ByteArrayInputStream(thumbnailBytes), thumbnailPath, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/products/" + mainImageFilename; // Return URL of the main image
        } catch (IOException e) {
            throw new RuntimeException("Failed to store product image.", e);
        }
    }

    @Override
    public void deleteFile(String fileName) {
        try {
            Path fileToDelete = rootLocation.resolve(fileName.replace("/uploads/", ""));
            Files.deleteIfExists(fileToDelete);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + fileName, e);
        }
    }

    @Override
    public void deleteProductImage(String imageUrl) {
        try {
            String filename = Paths.get(imageUrl).getFileName().toString();
            String baseFilename = filename.substring(0, filename.lastIndexOf('.'));
            String extension = getFileExtension(filename);

            // Delete main image
            Path mainImagePath = productImagesLocation.resolve(filename);
            Files.deleteIfExists(mainImagePath);

            // Delete thumbnail image (assuming thumbnail filename convention)
            Path thumbnailPath = productThumbnailsLocation.resolve(baseFilename + "_thumb." + extension);
            Files.deleteIfExists(thumbnailPath);

        } catch (IOException e) {
            throw new RuntimeException("Failed to delete product image: " + imageUrl, e);
        }
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex == -1) ? "" : filename.substring(dotIndex + 1);
    }
}