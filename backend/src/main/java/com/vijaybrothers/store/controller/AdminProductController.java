package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.ProductCreateRequest;
import com.vijaybrothers.store.dto.ProductDto;
import com.vijaybrothers.store.dto.ProductSummaryDto;
import com.vijaybrothers.store.dto.ProductUpdateRequest;
import com.vijaybrothers.store.service.AdminProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService svc;

    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductDto>> getLowStock() {
        List<ProductDto> list = svc.lowStock();
        return ResponseEntity.ok(list);
    }

    @PostMapping(consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Map<String, String>> create(
        @Valid @ModelAttribute ProductCreateRequest req
    ) {
        svc.createProduct(req);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(Map.of("message", "Product is added successfully"));
    }

    @GetMapping
    public Page<ProductSummaryDto> listAll(
        Pageable pageable,
        @RequestParam(name = "includeDeleted", defaultValue = "false") boolean includeDeleted
    ) {
        return svc.listProducts(pageable, includeDeleted);
    }

    @PutMapping(value = "/{productId}", consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Map<String, String>> update(
        @PathVariable Integer productId,
        @Valid @ModelAttribute ProductUpdateRequest req
    ) {
        svc.updateProduct(productId, req); // Pass both productId and req
        return ResponseEntity
            .ok(Map.of("message", "Product is updated successfully"));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Map<String, String>> delete(
        @PathVariable Integer productId
    ) {
        svc.deleteProduct(productId);
        return ResponseEntity
            .ok(Map.of("message", "Product is deleted successfully"));
    }

    @PutMapping("/{productId}/restore")
    public ResponseEntity<Map<String, String>> restore(
        @PathVariable Integer productId
    ) {
        svc.restoreProduct(productId);
        return ResponseEntity
            .ok(Map.of("message", "Product is restored successfully"));
    }
}