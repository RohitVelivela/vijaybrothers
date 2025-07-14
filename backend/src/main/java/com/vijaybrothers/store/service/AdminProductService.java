// src/main/java/com/vijaybrothers/store/service/AdminProductService.java
package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.ProductCreateRequest;
import com.vijaybrothers.store.dto.ProductDto;
import com.vijaybrothers.store.dto.ProductSummaryDto;
import com.vijaybrothers.store.dto.ProductUpdateRequest;
import com.vijaybrothers.store.model.Category;
import com.vijaybrothers.store.model.Product;
import com.vijaybrothers.store.repository.CategoryRepository;
import com.vijaybrothers.store.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class AdminProductService {
    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;

    /** Low-stock cutoff from properties (default 5) */
    @Value("${app.lowStockThreshold:5}")
    private int lowStockThreshold;

    /**
     * Creates a new product record.
     * Called by POST /api/admin/products
     */
    @Transactional
    public void createProduct(ProductCreateRequest req) {
        Category cat = categoryRepo.findById(req.getCategoryId())
            .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        Product p = new Product();
        p.setProductCode(req.getProductCode());
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setCategory(cat);
        p.setStockQuantity(req.getStockQuantity());
        p.setInStock(req.getInStock());
        p.setYoutubeLink(req.getYoutubeLink());
        p.setMainImageUrl(req.getMainImageUrl());
        p.setCreatedAt(Instant.now());
        p.setUpdatedAt(Instant.now());

        productRepo.save(p);
    }

    /**
     * Get list of products that are under the low-stock threshold.
     * Called by GET /api/admin/products/low-stock
     */
    @Transactional(readOnly = true)
    public List<ProductDto> lowStock() {
        return productRepo.findByStockQuantityLessThan(lowStockThreshold)
            .stream()
            .map(ProductDto::fromEntity)
            .collect(Collectors.toList());
    }

    /**
     * Fetch a summary list of all products.
     * Called by GET /api/admin/products
     */
    @Transactional(readOnly = true)
    public Page<ProductSummaryDto> listProducts(Pageable pageable) {
        return productRepo.findAll(pageable).map(p -> new ProductSummaryDto(
                p.getProductId(),
                p.getProductCode(),
                p.getName(),
                p.getMainImageUrl(),
                p.getPrice(),
                p.getInStock(),
                p.getCategory() != null ? p.getCategory().getCategoryId() : null
            ));
    }

    /**
     * Updates an existing product.
     * HTTP Method: PUT
     * Path: /api/admin/products/{productId}
     */
    @Transactional
    public void updateProduct(Integer productId, ProductUpdateRequest req) {
        Product p = productRepo.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (req.getProductCode() != null) {
            p.setProductCode(req.getProductCode());
        }
        if (req.getName() != null) {
            p.setName(req.getName());
        }
        if (req.getDescription() != null) {
            p.setDescription(req.getDescription());
        }
        if (req.getPrice() != null) {
            p.setPrice(req.getPrice());
        }
        if (req.getCategoryId() != null) {
            Category cat = categoryRepo.findById(req.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            p.setCategory(cat);
        }
        if (req.getStockQuantity() != null) {
            p.setStockQuantity(req.getStockQuantity());
        }
        if (req.getInStock() != null) {
            p.setInStock(req.getInStock());
        }
        if (req.getYoutubeLink() != null) {
            p.setYoutubeLink(req.getYoutubeLink());
        }
        if (req.getMainImageUrl() != null) {
            p.setMainImageUrl(req.getMainImageUrl());
        }
        p.setUpdatedAt(Instant.now());

        productRepo.save(p);
    }

    /**
     * DELETE /api/admin/products/{productId}
     * Remove the product with the given ID.
     */
    @Transactional
    public void deleteProduct(Integer productId) {
        if (!productRepo.existsById(productId)) {
            throw new IllegalArgumentException("Product not found");
        }
        productRepo.deleteById(productId);
    }
}
