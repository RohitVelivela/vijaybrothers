package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.CategoryCreateRequest;
import com.vijaybrothers.store.dto.CategoryProductAssignRequest;
import com.vijaybrothers.store.model.Category;
import com.vijaybrothers.store.service.AdminCategoryService;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final AdminCategoryService service;

    /**
     * Retrieves all categories
     * GET /api/admin/categories
     *
     * @return 200 OK with list of categories
     */
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(service.getAllCategories());
    }

    /**
     * Creates a new product category

     * POST /api/admin/categories
     * 
     * @param req The category details
     * @return 201 CREATED with success message, or 400 BAD REQUEST if validation fails
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> createCategory(
            @Valid @RequestBody CategoryCreateRequest req
    ) {
        try {
            service.createCategory(req);
            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "Category is created successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Assigns multiple products to a category in bulk
     * POST /api/admin/categories/{categoryId}/products
     * 
     * @param categoryId The ID of the category to assign products to
     * @param req Request containing list of product IDs
     * @return 200 OK with success message, or error response
     */
    @PostMapping("/{categoryId}/products")
    public ResponseEntity<Map<String, String>> assignProducts(
            @PathVariable Integer categoryId,
            @Valid @RequestBody CategoryProductAssignRequest req
    ) {
        try {
            service.assignProductsToCategory(categoryId, req);
            return ResponseEntity.ok(Map.of("message", "Products assigned to category successfully"));
        } catch (IllegalArgumentException e) {
            String error = e.getMessage();
            HttpStatus status = error.equals("Category not found") ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
            return ResponseEntity
                .status(status)
                .body(Map.of("error", error));
        }
    }

    /**
     * Deletes a category
     * DELETE /api/admin/categories/{id}
     * 
     * @param id The ID of the category to delete
     * @return 204 NO CONTENT on success, or error response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Integer id) {
        try {
            service.deleteCategory(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
