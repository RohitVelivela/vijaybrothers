package com.vijaybrothers.store.dto;

import com.vijaybrothers.store.model.Product;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductResponseDto {
    private Long productId;
    private String productCode;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer categoryId;
    private Integer stockQuantity;
    private Boolean isInStock;
    private String youtubeLink;
    private String mainImageUrl;
    private String color;
    private String fabric;

    public static ProductResponseDto fromEntity(Product product) {
        ProductResponseDto dto = new ProductResponseDto();
        dto.setProductId(product.getProductId().longValue());
        dto.setProductCode(product.getProductCode());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCategoryId(product.getCategory() != null ? product.getCategory().getCategoryId() : null);
        dto.setStockQuantity(product.getStockQuantity());
        dto.setIsInStock(product.getInStock());
        dto.setYoutubeLink(product.getYoutubeLink());
        dto.setMainImageUrl(product.getMainImageUrl());
        dto.setColor(product.getColor());
        dto.setFabric(product.getFabric());
        return dto;
    }
}
