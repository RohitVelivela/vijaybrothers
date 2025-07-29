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
    
    private String color;
    private String fabric;

    // Getters
    public Long getProductId() { return productId; }
    public String getProductCode() { return productCode; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public Integer getCategoryId() { return categoryId; }
    public Integer getStockQuantity() { return stockQuantity; }
    public Boolean getIsInStock() { return isInStock; }
    public String getYoutubeLink() { return youtubeLink; }
    public String getColor() { return color; }
    public String getFabric() { return fabric; }

    // Setters
    public void setProductId(Long productId) { this.productId = productId; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    public void setIsInStock(Boolean isInStock) { this.isInStock = isInStock; }
    public void setYoutubeLink(String youtubeLink) { this.youtubeLink = youtubeLink; }
    public void setColor(String color) { this.color = color; }
    public void setFabric(String fabric) { this.fabric = fabric; }

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
        dto.setColor(product.getColor());
        dto.setFabric(product.getFabric());
        return dto;
    }
}