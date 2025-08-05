// src/main/java/com/vijaybrothers/store/service/AdminProductService.java
package com.vijaybrothers.store.service;

import com.vijaybrothers.store.repository.CategoryRepository;
import com.vijaybrothers.store.repository.ProductImageRepository;

import com.vijaybrothers.store.dto.ProductCreateRequest;
import com.vijaybrothers.store.dto.ProductDto;
import com.vijaybrothers.store.dto.ProductSummaryDto;
import com.vijaybrothers.store.dto.ProductUpdateRequest;
import com.vijaybrothers.store.dto.ProductImageDto;
import com.vijaybrothers.store.model.Category;
import com.vijaybrothers.store.model.Product;
import com.vijaybrothers.store.model.ProductImage;

import com.vijaybrothers.store.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
    private final StorageService storageService;
    private final ProductImageRepository productImageRepo;

    /** Low-stock cutoff from properties (default 5) */
    @Value("${app.lowStockThreshold:5}")
    private int lowStockThreshold;

    /**
     * Creates a new product record.
     * Called by POST /api/admin/products
     */
    @Transactional
    public void createProduct(ProductCreateRequest req) {
        if (productRepo.findByProductCode(req.getProductCode()).isPresent()) {
            throw new IllegalArgumentException("Product with SKU '" + req.getProductCode() + "' already exists.");
        }

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
        p.setCreatedAt(Instant.now());
        p.setUpdatedAt(Instant.now());

        productRepo.save(p);

        // Handle product images
        if (req.getProductImages() != null && !req.getProductImages().isEmpty()) {
            for (int i = 0; i < req.getProductImages().size(); i++) {
                MultipartFile imageFile = req.getProductImages().get(i);
                String imageUrl = storageService.storeProductImage(imageFile, req.getName()); // Use new method
                ProductImage productImage = ProductImage.builder()
                        .imageUrl(imageUrl)
                        .product(p)
                        .isMain(i == 0) // Set first image as main
                        .displayOrder(i) // Assign display order based on index
                        .build();
                p.getImages().add(productImage);
            }
            productImageRepo.saveAll(p.getImages()); // Save new product images
        }
    }

    /**
     * Get list of products that are under the low-stock threshold.
     * Called by GET /api/admin/products/low-stock
     */
    @Transactional(readOnly = true)
    public List<ProductDto> lowStock() {
        return productRepo.findByStockQuantityLessThanAndDeletedFalse(lowStockThreshold)
            .stream()
            .map(ProductDto::fromEntity)
            .collect(Collectors.toList());
    }

    /**
     * Fetch a summary list of all products.
     * Called by GET /api/admin/products
     */
    @Transactional(readOnly = true)
    public Page<ProductSummaryDto> listProducts(Pageable pageable, boolean includeDeleted) {
        Page<Product> productsPage;
        if (includeDeleted) {
            productsPage = productRepo.findAll(pageable);
        } else {
            productsPage = productRepo.findByDeletedFalse(pageable);
        }
        return productsPage.map(p -> {
            System.out.println("Product ID: " + p.getProductId() + ", Stock Quantity: " + p.getStockQuantity());
            return new ProductSummaryDto(
                p.getProductId(),
                p.getProductCode(),
                p.getName(),
                p.getImages().stream()
                    .map(img -> new ProductImageDto(img.getId(), img.getImageUrl(), img.isMain()))
                    .collect(Collectors.toList()),
                p.getPrice(),
                p.getInStock(),
                p.getStockQuantity(),
                p.getCategory() != null ? p.getCategory().getCategoryId() : null,
                p.isDeleted(),
                p.getCreatedAt().toString()
            );
        });
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

        // Handle product images
        if (req.getProductImages() != null && !req.getProductImages().isEmpty()) {
            // Clear existing images if new ones are provided (optional, depending on desired behavior)
            p.getImages().forEach(productImage -> storageService.deleteProductImage(productImage.getImageUrl())); // Use new method
            p.getImages().clear();

            for (int i = 0; i < req.getProductImages().size(); i++) {
                MultipartFile imageFile = req.getProductImages().get(i);
                String imageUrl = storageService.storeProductImage(imageFile, p.getName()); // Use new method
                ProductImage productImage = ProductImage.builder()
                        .imageUrl(imageUrl)
                        .product(p)
                        .isMain(i == 0) // Set first image as main
                        .displayOrder(i) // Assign display order based on index
                        .build();
                p.getImages().add(productImage);
            }
        }

        p.setUpdatedAt(Instant.now());

        productRepo.save(p);
        productImageRepo.saveAll(p.getImages()); // Save new product images
    }

    /**
     * DELETE /api/admin/products/{productId}
     * Remove the product with the given ID.
     */
    @Transactional
    public void deleteProduct(Integer productId) {
        Product product = productRepo.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        product.setDeleted(true);
        product.setUpdatedAt(Instant.now());
        productRepo.save(product);
    }

    /**
     * PUT /api/admin/products/{productId}/restore
     * Restore the product with the given ID.
     */
    @Transactional
    public void restoreProduct(Integer productId) {
        Product product = productRepo.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        product.setDeleted(false);
        product.setUpdatedAt(Instant.now());
        productRepo.save(product);
    }
}