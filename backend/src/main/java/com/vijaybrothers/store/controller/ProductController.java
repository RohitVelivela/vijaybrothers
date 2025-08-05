package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.ProductDto;
import com.vijaybrothers.store.dto.ProductResponseDto;
import com.vijaybrothers.store.dto.ProductDetailDto;
import com.vijaybrothers.store.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    /**
     * GET /api/products/sku/{sku}
     * → Get a single product by its SKU/code
     */
    @GetMapping("/sku/{sku}")
    public ProductDto getBySku(@PathVariable String sku) {
        return service.getBySku(sku);
    }

    /**
     * GET /api/products/search?q=
     * → Search products by name or code, with paging
     * Query params: ?q=shirt&page=0&size=20
     */
    @GetMapping("/search")
    public Page<ProductDto> search(
        @RequestParam String q,
        @RequestParam(defaultValue="0") int page,
        @RequestParam(defaultValue="20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        // Add wildcards for partial matching
        String searchQuery = "%" + q.trim() + "%";
        return service.search(null, searchQuery, pageable);
    }

    /**
     * GET /api/products/in-stock
     * → List only products flagged in stock
     */
    @GetMapping("/in-stock")
    public List<ProductDto> inStock() {
        return service.inStock();
    }

    /**
     * GET /api/products/low-stock
     * → List products under low-stock threshold
     * → Used by admin dashboard / stats
     */
    @GetMapping("/low-stock")
    public List<ProductDto> lowStock() {
        return service.lowStock();
    }

    @GetMapping("/{id}")
    public ProductDetailDto getProductById(@PathVariable Integer id) {
        return service.getProductDetailById(id);
    }
}
