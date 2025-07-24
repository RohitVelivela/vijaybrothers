package com.vijaybrothers.store.service.impl;

import com.vijaybrothers.store.dto.CategoryCreateRequest;
import com.vijaybrothers.store.model.Category;
import com.vijaybrothers.store.model.Product;
import com.vijaybrothers.store.repository.CategoryRepository;
import com.vijaybrothers.store.repository.ProductRepository;
import com.vijaybrothers.store.service.AdminCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminCategoryServiceImpl implements AdminCategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    private final String UPLOAD_DIR = System.getProperty("user.home") + "/uploads/images/categories/";

    @Override
    @Transactional
    public void createCategory(CategoryCreateRequest req, MultipartFile image) {
        saveCategory(null, req, image);
    }

    @Override
    @Transactional
    public void updateCategory(Integer id, CategoryCreateRequest req, MultipartFile image) {
        saveCategory(id, req, image);
    }

    @Override
    @Transactional
    public void deleteCategory(Integer id) {
        // Soft-delete all products associated with this category first
        List<com.vijaybrothers.store.model.Product> productsToUpdate = productRepository.findByCategory_CategoryId(id);
        for (com.vijaybrothers.store.model.Product product : productsToUpdate) {
            product.setDeleted(true);
            product.setCategory(null); // Unlink product from category
            productRepository.save(product);
        }

        categoryRepository.deleteById(id);
    }

    private void saveCategory(Integer id, CategoryCreateRequest req, MultipartFile image) {
        try {
            Category cat;
            if (id != null) {
                cat = categoryRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
                cat.setUpdatedAt(Instant.now());
            } else {
                cat = new Category();
                // CreatedAt and UpdatedAt handled by entity
            }

            cat.setName(req.getName());
            cat.setSlug(req.getSlug());
            cat.setDescription(req.getDescription());
            if (req.getParentId() != null) {
                Category parentCategory = categoryRepository.findById(req.getParentId())
                        .orElseThrow(() -> new IllegalArgumentException("Parent category not found"));
                cat.setParentCategory(parentCategory);
            } else {
                cat.setParentCategory(null);
            }
            cat.setIsActive(req.getIsActive());
            cat.setPosition(req.getPosition());
            cat.setDisplayOrder(req.getDisplayOrder());

            // Parse displayTypes JSON string
            if (req.getDisplayTypes() != null && !req.getDisplayTypes().isEmpty()) {
                ObjectMapper objectMapper = new ObjectMapper();
                List<String> displayTypesList = objectMapper.readValue(req.getDisplayTypes(), new TypeReference<List<String>>() {});
                cat.setDisplayTypes(displayTypesList);
            } else {
                cat.setDisplayTypes(null);
            }

            if (image != null && !image.isEmpty()) {
                String imageUrl = saveImage(image);
                cat.setCategoryImage(imageUrl);
            } else if (cat.getCategoryImage() != null && (image == null || image.isEmpty())) {
                // If no new image and categoryImage is explicitly set to null/empty in request, delete old image
                deleteImage(cat.getCategoryImage());
                cat.setCategoryImage(null);
            }

            categoryRepository.save(cat);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save category image", e);
        }
    }

    private String saveImage(MultipartFile image) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        String fileName = UUID.randomUUID().toString() + "-" + image.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(image.getInputStream(), filePath);
        return "/uploads/images/categories/" + fileName; // Return relative path for URL
    }

    private void deleteImage(String imageUrl) {
        if (imageUrl != null && !imageUrl.isEmpty()) {
            // Extract filename from URL (e.g., /images/categories/uuid-filename.jpg)
            String fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                // Log the error, but don't throw, as it shouldn't prevent category deletion
                System.err.println("Failed to delete image file: " + filePath + ", Error: " + e.getMessage());
            }
        }
    }
}