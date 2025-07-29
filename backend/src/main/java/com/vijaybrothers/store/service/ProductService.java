package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.ProductResponseDto;
import com.vijaybrothers.store.dto.CreateProductRequest;
import com.vijaybrothers.store.dto.UpdateProductRequest;
import com.vijaybrothers.store.dto.ProductDetailDto;
import com.vijaybrothers.store.dto.ProductDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductService {
    List<ProductResponseDto> getAllProducts();
    ProductResponseDto getProductById(Integer id);
    ProductResponseDto getProductBySlug(String slug);
    ProductResponseDto createProduct(CreateProductRequest request);
    ProductResponseDto updateProduct(Integer id, UpdateProductRequest request);
    void deleteProduct(Integer id);
    List<ProductResponseDto> searchProducts(String keyword);
    List<ProductResponseDto> getProductsByCategory(Integer categoryId);
    List<ProductResponseDto> getLowStockProducts();
    ProductDetailDto getProductDetailById(Integer productId);
    ProductDto getBySku(String sku);
    Page<ProductDto> search(Integer categoryId, String q, Pageable pageable);
    List<ProductDto> inStock();
    List<ProductDto> lowStock();
}