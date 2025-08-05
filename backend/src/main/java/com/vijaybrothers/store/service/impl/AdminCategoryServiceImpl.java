package com.vijaybrothers.store.service.impl;

import com.vijaybrothers.store.dto.CategoryCreateRequest;
import com.vijaybrothers.store.model.Category;
import com.vijaybrothers.store.model.Product;
import com.vijaybrothers.store.repository.CategoryRepository;
import com.vijaybrothers.store.repository.ProductRepository;
import com.vijaybrothers.store.service.AdminCategoryService;
import com.vijaybrothers.store.service.StorageService; // Import StorageService
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
    private final StorageService storageService; // Inject StorageService

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
        // Check for any ACTIVE products associated with this category.
        List<Product> activeProducts = productRepository.findByCategory_CategoryIdAndDeletedFalse(id);
        if (!activeProducts.isEmpty()) {
            // If there are active products, prevent deletion.
            throw new IllegalArgumentException("Cannot delete category with associated products. Please delete the products first.");
        }

        // If we are here, it means there are no ACTIVE products.
        // Now, we need to handle the soft-deleted products that still have the foreign key.
        // We will unlink them from the category before deleting the category.
        List<Product> softDeletedProducts = productRepository.findByCategory_CategoryId(id);
        for (Product product : softDeletedProducts) {
            product.setCategory(null);
            productRepository.save(product);
        }

        // Get the category to delete to retrieve its image path
        Category categoryToDelete = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        // Delete the associated image file using StorageService
        if (categoryToDelete.getCategoryImage() != null && !categoryToDelete.getCategoryImage().isEmpty()) {
            storageService.deleteFile(categoryToDelete.getCategoryImage());
        }

        // Now that all associated products (which are all soft-deleted) are unlinked,
        // we can safely delete the category.
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

            // Ensure position and displayOrder are not null
            cat.setPosition(req.getPosition() != null ? req.getPosition() : 0);
            cat.setDisplayOrder(req.getDisplayOrder() != null ? req.getDisplayOrder() : 0);

            // Parse displayTypes JSON string
            if (req.getDisplayTypes() != null && !req.getDisplayTypes().isEmpty()) {
                ObjectMapper objectMapper = new ObjectMapper();
                List<String> displayTypesList = objectMapper.readValue(req.getDisplayTypes(), new TypeReference<List<String>>() {});
                cat.setDisplayTypes(displayTypesList);
            } else {
                cat.setDisplayTypes(null);
            }

            if (image != null && !image.isEmpty()) {
                // New image provided, save it using StorageService
                String imageUrl = storageService.store(image, "images/categories", req.getName());
                cat.setCategoryImage(imageUrl);
            } else if (req.getCategoryImage() != null && !req.getCategoryImage().isEmpty()) {
                // No new image, but frontend sent an existing image URL, so keep it
                cat.setCategoryImage(req.getCategoryImage());
            } else {
                // No new image, and no existing image URL sent from frontend, so clear it
                // This covers cases where the image was explicitly removed in the UI
                // or was never set.
                if (cat.getCategoryImage() != null) { // Only delete if there was an old image
                    storageService.deleteFile(cat.getCategoryImage());
                }
                cat.setCategoryImage(null);
            }

            categoryRepository.save(cat);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save category image", e);
        }
    }
}