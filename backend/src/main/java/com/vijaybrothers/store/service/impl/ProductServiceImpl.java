package com.vijaybrothers.store.service.impl;

import com.vijaybrothers.store.dto.ProductResponseDto;
import com.vijaybrothers.store.dto.CreateProductRequest;
import com.vijaybrothers.store.dto.UpdateProductRequest;
import com.vijaybrothers.store.dto.ProductDetailDto;
import com.vijaybrothers.store.dto.ProductDto;
import com.vijaybrothers.store.model.Product;
import com.vijaybrothers.store.exception.ResourceNotFoundException;
import com.vijaybrothers.store.repository.ProductRepository;
import com.vijaybrothers.store.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Value("${app.lowStockThreshold:5}")
    private int lowStockThreshold;

    @Override
    public List<ProductResponseDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponseDto getProductById(Integer id) {
        return productRepository.findById(id)
                .map(ProductResponseDto::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Override
    public ProductResponseDto getProductBySlug(String slug) {
        return productRepository.findBySlug(slug)
                .map(ProductResponseDto::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
    }

    @Override
    public ProductResponseDto createProduct(CreateProductRequest req) {
        Product product = req.toEntity();
        Product savedProduct = productRepository.save(product);
        return ProductResponseDto.fromEntity(savedProduct);
    }

    @Override
    public ProductResponseDto updateProduct(Integer id, UpdateProductRequest req) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        req.updateEntity(existingProduct);
        Product savedProduct = productRepository.save(existingProduct);
        return ProductResponseDto.fromEntity(savedProduct);
    }

    @Override
    public void deleteProduct(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    @Override
    public List<ProductResponseDto> searchProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            throw new IllegalArgumentException("Search keyword cannot be empty");
        }
        return productRepository.findByNameContainingIgnoreCase(keyword).stream()
                .map(ProductResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponseDto> getProductsByCategory(Integer categoryId) {
        if (categoryId == null) {
            throw new IllegalArgumentException("Category ID cannot be null");
        }
        return productRepository.findByCategory_CategoryId(categoryId).stream()
                .map(ProductResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponseDto> getLowStockProducts() {
        return productRepository.findByStockQuantityLessThanEqual(lowStockThreshold).stream()
                .map(ProductResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDetailDto getProductDetailById(Integer productId) {
        return productRepository.findByIdWithCategoryAndImages(productId)
                .map(ProductDetailDto::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
    }

    @Override
    public ProductDto getBySku(String sku) {
        return productRepository.findByProductCode(sku)
                .map(ProductDto::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with sku: " + sku));
    }

    @Override
    public Page<ProductDto> search(Integer categoryId, String q, Pageable pageable) {
        return productRepository.search(categoryId, q, pageable)
                .map(ProductDto::fromEntity);
    }

    @Override
    public List<ProductDto> inStock() {
        return productRepository.findByInStock(true).stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> lowStock() {
        return productRepository.findByStockQuantityLessThanAndDeletedFalse(lowStockThreshold).stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());
    }
}
