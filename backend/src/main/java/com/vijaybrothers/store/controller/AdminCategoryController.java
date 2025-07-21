package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.CategoryCreateRequest;
import com.vijaybrothers.store.service.AdminCategoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vijaybrothers.store.model.Category;
import com.vijaybrothers.store.repository.CategoryRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.vijaybrothers.store.repository.ProductRepository;
import com.vijaybrothers.store.model.Product;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

 @RestController @RequestMapping("/api/admin/categories") @RequiredArgsConstructor
public class AdminCategoryController {

    private final AdminCategoryService categoryService;
    private final ObjectMapper objectMapper;
    private final CategoryRepository categoryRepository;
private final ProductRepository productRepository;

    /** Create a new category (JSON + optional file) */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String,String>> createCategory(
        @ModelAttribute @Valid CategoryCreateRequest req,
        @RequestPart(value="image", required=false) MultipartFile image
    ) {
        try {
            categoryService.createCategory(req, image);
            return ResponseEntity
              .status(HttpStatus.CREATED)
              .body(Map.of("message","Category created successfully"));
        } catch (Exception e) {
            return ResponseEntity
              .badRequest()
              .body(Map.of("error","Invalid request: " +e.getMessage()));
        }
    }

    /** Update an existing category */
    @PutMapping(path="/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String,String>> updateCategory(
        @PathVariable Integer id,
        @ModelAttribute @Valid CategoryCreateRequest req,
        @RequestPart(value="image", required=false) MultipartFile image
    ) {
        try {
            categoryService.updateCategory(id, req, image);
            return ResponseEntity.ok(Map.of("message","Category updated successfully"));
        } catch (Exception e) {
            return ResponseEntity
              .status(HttpStatus.BAD_REQUEST)
              .body(Map.of("error","Invalid request: " +e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        List<Map<String, Object>> dtos = categories.stream().map(c -> {
            Map<String, Object> dto = new HashMap<>();
            dto.put("categoryId", c.getCategoryId());
            dto.put("name", c.getName());
            dto.put("slug", c.getSlug());
            dto.put("description", c.getDescription());
            dto.put("categoryImage", c.getCategoryImage());
            dto.put("parentId", c.getParentCategory() != null ? c.getParentCategory().getCategoryId() : null);
            dto.put("parentName", c.getParentCategory() != null ? c.getParentCategory().getName() : null);
            dto.put("isActive", c.getIsActive());
            dto.put("position", c.getPosition());
            dto.put("createdAt", c.getCreatedAt().toString());
            dto.put("updatedAt", c.getUpdatedAt().toString());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCategory(@PathVariable Integer id) {
        List<Product> products = productRepository.findByCategory_CategoryId(id);
        if (!products.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Cannot delete category with assigned products."));
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Category deleted successfully."));
    }
}