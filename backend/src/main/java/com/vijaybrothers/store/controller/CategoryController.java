package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.CategoryDto;
import com.vijaybrothers.store.dto.CategoryRequest;
import com.vijaybrothers.store.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@Validated
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        // Implement getAllCategories or return empty list if not supported
        return ResponseEntity.ok(List.of());
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CategoryRequest request) {
        // Implement createCategory or return bad request if not supported
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Integer id, @Valid @RequestBody CategoryRequest request) {
        CategoryDto updatedCategory = categoryService.update(id, request);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
        // Implement deleteCategory or return no content if not supported
        return ResponseEntity.noContent().build();
    }
}
