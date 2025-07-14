package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.CategoryCreateRequest;
import com.vijaybrothers.store.dto.CategoryProductAssignRequest;
import com.vijaybrothers.store.model.Category;
import com.vijaybrothers.store.model.Product;
import com.vijaybrothers.store.repository.CategoryRepository;
import com.vijaybrothers.store.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminCategoryService {

    private final CategoryRepository categoryRepo;
    private final ProductRepository productRepo;

    /**
     * Creates a new product category
     * 
     * @param req The category details
     * @throws IllegalArgumentException if a category with the same slug already exists
     */
    @Transactional
    public void createCategory(CategoryCreateRequest req) {
        // Check if slug is already taken
        if (categoryRepo.existsBySlug(req.slug())) {
            throw new IllegalArgumentException("A category with this slug already exists");
        }

        Category category = new Category();
        category.setName(req.name());
        category.setSlug(req.slug());
        category.setDescription(req.description());
        category.setCreatedAt(Instant.now());
        category.setUpdatedAt(Instant.now());

        categoryRepo.save(category);
    }

    /**
     * Assigns multiple products to a category in bulk
     * 
     * @param categoryId The ID of the category to assign products to
     * @param req Request containing list of product IDs
     * @throws IllegalArgumentException if category not found or products not found
     */
    @Transactional
    public void assignProductsToCategory(Integer categoryId, CategoryProductAssignRequest req) {
        // 1. Find and validate category exists
        Category category = categoryRepo.findById(categoryId)
            .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        // 2. Find all requested products
        List<Product> products = productRepo.findAllById(req.productIds());
        
        // 3. Validate all products were found
        if (products.size() != req.productIds().size()) {
            Set<Integer> foundIds = products.stream()
                .map(Product::getProductId)
                .collect(Collectors.toSet());
            List<Integer> missingIds = req.productIds().stream()
                .filter(id -> !foundIds.contains(id))
                .toList();
            throw new IllegalArgumentException("Products not found: " + missingIds);
        }

        // 4. Update all products with new category
        Instant now = Instant.now();
        for (Product product : products) {
            product.setCategory(category);
            product.setUpdatedAt(now);
        }

        // 5. Save all changes
        productRepo.saveAll(products);
    }

    /**
     * Deletes a category
     * 
     * @param categoryId The ID of the category to delete
     * @throws IllegalArgumentException if category not found
     * @throws IllegalStateException if category has linked products
     */
    @Transactional
    public void deleteCategory(Integer categoryId) {
        Category category = categoryRepo.findById(categoryId)
            .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        // Check if category has linked products
        if (productRepo.existsByCategory_CategoryId(categoryId)) {
            throw new IllegalStateException("Cannot delete category with products");
        }

        categoryRepo.delete(category);
    }

    /**
     * Retrieves all categories.
     *
     * @return A list of all categories.
     */
    public List<Category> getAllCategories() {
        return categoryRepo.findAll();
    }
}
