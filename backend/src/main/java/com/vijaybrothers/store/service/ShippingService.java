package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.shipping.ShippingConfigDto;
import com.vijaybrothers.store.dto.shipping.ProductShippingDto;
import com.vijaybrothers.store.model.*;
import com.vijaybrothers.store.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShippingService {
    
    private final ShippingConfigurationRepository shippingConfigRepository;
    private final ProductShippingRepository productShippingRepository;
    private final ProductRepository productRepository;
    
    // Get global shipping configuration
    public ShippingConfigDto getShippingConfiguration() {
        ShippingConfiguration config = shippingConfigRepository.findTopByOrderByConfigIdDesc()
            .orElseGet(() -> {
                // Create default configuration if none exists
                ShippingConfiguration defaultConfig = ShippingConfiguration.builder()
                    .globalFreeShipping(false)
                    .defaultShippingCharge(new BigDecimal("50.00"))
                    .minOrderForFreeShipping(new BigDecimal("500.00"))
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();
                return shippingConfigRepository.save(defaultConfig);
            });
        
        return mapToDto(config);
    }
    
    // Update global shipping configuration
    @Transactional
    public ShippingConfigDto updateShippingConfiguration(ShippingConfigDto dto) {
        ShippingConfiguration config = shippingConfigRepository.findTopByOrderByConfigIdDesc()
            .orElseGet(ShippingConfiguration::new);
        
        config.setGlobalFreeShipping(dto.getGlobalFreeShipping());
        config.setDefaultShippingCharge(dto.getDefaultShippingCharge());
        config.setMinOrderForFreeShipping(dto.getMinOrderForFreeShipping());
        config.setUpdatedBy(dto.getUpdatedBy());
        
        ShippingConfiguration saved = shippingConfigRepository.save(config);
        return mapToDto(saved);
    }
    
    // Get all products with their shipping settings
    public List<ProductShippingDto> getAllProductShippingSettings() {
        // Get all products - using a large page size to get all products
        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE);
        List<Product> allProducts = productRepository.findByDeletedFalse(pageable).getContent();
        
        return allProducts.stream().map(product -> {
            ProductShipping shipping = productShippingRepository.findByProduct(product)
                .orElse(null);
            
            return mapToProductShippingDto(product, shipping);
        }).collect(Collectors.toList());
    }
    
    // Update product-specific shipping settings
    @Transactional
    public ProductShippingDto updateProductShipping(Integer productId, ProductShippingDto dto) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        ProductShipping shipping = productShippingRepository.findByProduct(product)
            .orElseGet(() -> ProductShipping.builder()
                .product(product)
                .createdAt(Instant.now())
                .build());
        
        shipping.setHasFreeShipping(dto.getHasFreeShipping());
        shipping.setShippingCharge(dto.getShippingCharge());
        shipping.setIsHeavyItem(dto.getIsHeavyItem());
        shipping.setAdditionalCharge(dto.getAdditionalCharge());
        shipping.setUpdatedAt(Instant.now());
        
        ProductShipping saved = productShippingRepository.save(shipping);
        return mapToProductShippingDto(product, saved);
    }
    
    // Bulk update product shipping settings
    @Transactional
    public void bulkUpdateProductShipping(List<ProductShippingDto> updates) {
        for (ProductShippingDto dto : updates) {
            if (dto.getProductId() != null) {
                updateProductShipping(dto.getProductId(), dto);
            }
        }
    }
    
    // Calculate shipping charge for a product
    public BigDecimal calculateShippingCharge(Integer productId, BigDecimal orderTotal) {
        ShippingConfiguration globalConfig = shippingConfigRepository.findTopByOrderByConfigIdDesc()
            .orElse(null);
        
        // Check if global free shipping is enabled
        if (globalConfig != null && Boolean.TRUE.equals(globalConfig.getGlobalFreeShipping())) {
            return BigDecimal.ZERO;
        }
        
        // Check if order qualifies for free shipping based on minimum order amount
        if (globalConfig != null && globalConfig.getMinOrderForFreeShipping() != null 
            && orderTotal.compareTo(globalConfig.getMinOrderForFreeShipping()) >= 0) {
            return BigDecimal.ZERO;
        }
        
        // Check product-specific shipping settings
        ProductShipping productShipping = productShippingRepository.findByProductProductId(productId)
            .orElse(null);
        
        if (productShipping != null) {
            if (Boolean.TRUE.equals(productShipping.getHasFreeShipping())) {
                return BigDecimal.ZERO;
            }
            
            BigDecimal charge = productShipping.getShippingCharge() != null 
                ? productShipping.getShippingCharge() 
                : BigDecimal.ZERO;
            
            if (Boolean.TRUE.equals(productShipping.getIsHeavyItem()) && productShipping.getAdditionalCharge() != null) {
                charge = charge.add(productShipping.getAdditionalCharge());
            }
            
            return charge;
        }
        
        // Return default shipping charge
        return globalConfig != null && globalConfig.getDefaultShippingCharge() != null 
            ? globalConfig.getDefaultShippingCharge() 
            : new BigDecimal("50.00");
    }
    
    // Helper methods
    private ShippingConfigDto mapToDto(ShippingConfiguration config) {
        return ShippingConfigDto.builder()
            .configId(config.getConfigId())
            .globalFreeShipping(config.getGlobalFreeShipping())
            .defaultShippingCharge(config.getDefaultShippingCharge())
            .minOrderForFreeShipping(config.getMinOrderForFreeShipping())
            .updatedBy(config.getUpdatedBy())
            .build();
    }
    
    private ProductShippingDto mapToProductShippingDto(Product product, ProductShipping shipping) {
        ProductShippingDto dto = ProductShippingDto.builder()
            .productId(product.getProductId())
            .productName(product.getName())
            .productCode(product.getProductCode())
            .productPrice(product.getPrice())
            .productImage(product.getImages() != null && !product.getImages().isEmpty() 
                ? product.getImages().get(0).getImageUrl() : null)
            .build();
        
        if (shipping != null) {
            dto.setShippingId(shipping.getShippingId());
            dto.setHasFreeShipping(shipping.getHasFreeShipping());
            dto.setShippingCharge(shipping.getShippingCharge());
            dto.setIsHeavyItem(shipping.getIsHeavyItem());
            dto.setAdditionalCharge(shipping.getAdditionalCharge());
        } else {
            // Default values if no specific shipping config exists
            dto.setHasFreeShipping(false);
            dto.setShippingCharge(BigDecimal.ZERO);
            dto.setIsHeavyItem(false);
            dto.setAdditionalCharge(BigDecimal.ZERO);
        }
        
        return dto;
    }
}