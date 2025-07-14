package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.*;
import com.vijaybrothers.store.model.Category;
import com.vijaybrothers.store.model.Product;
import com.vijaybrothers.store.repository.CategoryRepository;
import com.vijaybrothers.store.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepo;
    private final ProductRepository productRepo;

    @Transactional
    public CategoryDto update(Integer id, CategoryRequest req) {
        Category c = categoryRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        c.setName(req.name());
        c.setSlug(req.slug());
        c.setDescription(req.description());
        Category saved = categoryRepo.save(c);
        return CategoryDto.from(saved);
    }

    /**
     * Get all products in a specific category
     * 
     * @param categoryId The ID of the category to get products from
     * @return List of products in the category as DTOs
     * @throws IllegalArgumentException if category not found
     */
    @Transactional(readOnly = true)
    public List<ProductSummaryDto> getProductsByCategory(Integer categoryId) {
        // 1. Validate category exists
        // Validate category exists; the result is implicitly used by orElseThrow for validation.
        categoryRepo.findById(categoryId)
            .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        // 2. Get and transform products
        return productRepo.findByCategory_CategoryId(categoryId).stream()
            .map(this::toProductSummaryDto)
            .collect(Collectors.toList());
    }

    /**
     * Convert Product entity to ProductSummaryDto
     */    private ProductSummaryDto toProductSummaryDto(Product product) {
        return new ProductSummaryDto(
            product.getProductId(),
            product.getProductCode(),
            product.getName(),
            product.getMainImageUrl(),
            product.getPrice(),
            product.getInStock(),
            product.getCategory() != null ? product.getCategory().getCategoryId() : null
        );
    }
}
