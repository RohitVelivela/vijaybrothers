package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.shipping.ShippingConfigDto;
import com.vijaybrothers.store.dto.shipping.ProductShippingDto;
import com.vijaybrothers.store.service.ShippingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/shipping")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class AdminShippingController {
    
    private final ShippingService shippingService;
    
    // Get global shipping configuration
    @GetMapping("/config")
    public ResponseEntity<ShippingConfigDto> getShippingConfig() {
        log.info("Fetching shipping configuration");
        ShippingConfigDto config = shippingService.getShippingConfiguration();
        return ResponseEntity.ok(config);
    }
    
    // Update global shipping configuration
    @PutMapping("/config")
    public ResponseEntity<ShippingConfigDto> updateShippingConfig(@RequestBody ShippingConfigDto dto) {
        log.info("Updating shipping configuration");
        ShippingConfigDto updated = shippingService.updateShippingConfiguration(dto);
        return ResponseEntity.ok(updated);
    }
    
    // Get all products with shipping settings
    @GetMapping("/products")
    public ResponseEntity<List<ProductShippingDto>> getAllProductShipping() {
        log.info("Fetching all product shipping settings");
        List<ProductShippingDto> products = shippingService.getAllProductShippingSettings();
        return ResponseEntity.ok(products);
    }
    
    // Update single product shipping settings
    @PutMapping("/products/{productId}")
    public ResponseEntity<ProductShippingDto> updateProductShipping(
            @PathVariable Integer productId,
            @RequestBody ProductShippingDto dto) {
        log.info("Updating shipping settings for product: {}", productId);
        ProductShippingDto updated = shippingService.updateProductShipping(productId, dto);
        return ResponseEntity.ok(updated);
    }
    
    // Bulk update product shipping settings
    @PostMapping("/products/bulk")
    public ResponseEntity<Void> bulkUpdateProductShipping(@RequestBody List<ProductShippingDto> updates) {
        log.info("Bulk updating {} product shipping settings", updates.size());
        shippingService.bulkUpdateProductShipping(updates);
        return ResponseEntity.ok().build();
    }
}