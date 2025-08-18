package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.shipping.ShippingCalculationRequest;
import com.vijaybrothers.store.dto.shipping.ShippingCalculationResponse;
import com.vijaybrothers.store.service.ShippingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/shipping")
@RequiredArgsConstructor
@Slf4j
public class ShippingController {
    
    private final ShippingService shippingService;
    
    // Calculate shipping for cart items (public endpoint)
    @PostMapping("/calculate")
    public ResponseEntity<ShippingCalculationResponse> calculateShipping(@RequestBody ShippingCalculationRequest request) {
        log.info("Calculating shipping for {} items, order total: {}", 
            request.getProductIds().size(), request.getOrderTotal());
        
        BigDecimal totalShipping = BigDecimal.ZERO;
        boolean freeShipping = false;
        
        // Check global configuration first
        var config = shippingService.getShippingConfiguration();
        
        // If global free shipping is enabled
        if (Boolean.TRUE.equals(config.getGlobalFreeShipping())) {
            freeShipping = true;
        }
        // Check if order meets minimum for free shipping
        else if (config.getMinOrderForFreeShipping() != null && 
                 request.getOrderTotal().compareTo(config.getMinOrderForFreeShipping()) >= 0) {
            freeShipping = true;
        }
        // Calculate shipping for each product
        else {
            for (Integer productId : request.getProductIds()) {
                BigDecimal productShipping = shippingService.calculateShippingCharge(
                    productId, request.getOrderTotal());
                totalShipping = totalShipping.add(productShipping);
            }
            
            // Cap the maximum shipping charge if needed
            BigDecimal maxShipping = new BigDecimal("200"); // Maximum shipping charge
            if (totalShipping.compareTo(maxShipping) > 0) {
                totalShipping = maxShipping;
            }
        }
        
        ShippingCalculationResponse response = ShippingCalculationResponse.builder()
            .shippingCharge(freeShipping ? BigDecimal.ZERO : totalShipping)
            .freeShipping(freeShipping)
            .minOrderForFreeShipping(config.getMinOrderForFreeShipping())
            .message(freeShipping ? "Free shipping applied!" : 
                     config.getMinOrderForFreeShipping() != null ? 
                     String.format("Add ₹%.2f more for free shipping", 
                         config.getMinOrderForFreeShipping().subtract(request.getOrderTotal()).max(BigDecimal.ZERO)) : 
                     "Standard shipping charges apply")
            .build();
        
        return ResponseEntity.ok(response);
    }
}