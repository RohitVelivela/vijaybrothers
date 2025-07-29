package com.vijaybrothers.store.dto;

import com.vijaybrothers.store.model.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Integer productId;
    private String productCode;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer categoryId;
    private List<ProductImageDto> images;
    private Integer stockQuantity;
    private Boolean inStock;
    private String youtubeLink;
    private String color;
    private String fabric;
    private boolean deleted;
    private String createdAt;

    // Getters
    public Integer getProductId() { return productId; }
    public String getProductCode() { return productCode; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public Integer getCategoryId() { return categoryId; }
    public List<ProductImageDto> getImages() { return images; }
    public Integer getStockQuantity() { return stockQuantity; }
    public Boolean getInStock() { return inStock; }
    public String getYoutubeLink() { return youtubeLink; }
    public String getColor() { return color; }
    public String getFabric() { return fabric; }
    public boolean isDeleted() { return deleted; }
    public String getCreatedAt() { return createdAt; }

    // Setters
    public void setProductId(Integer productId) { this.productId = productId; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }
    public void setImages(List<ProductImageDto> images) { this.images = images; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }
    public void setYoutubeLink(String youtubeLink) { this.youtubeLink = youtubeLink; }
    public void setColor(String color) { this.color = color; }
    public void setFabric(String fabric) { this.fabric = fabric; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public static ProductDto fromEntity(Product product) {
        ProductDto dto = new ProductDto();
        dto.setProductId(product.getProductId());
        dto.setProductCode(product.getProductCode());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCategoryId(product.getCategory() != null ? product.getCategory().getCategoryId() : null);
        dto.setImages(product.getImages().stream()
                .map(img -> new ProductImageDto(img.getId().intValue(), img.getImageUrl(), img.isMain()))
                .collect(Collectors.toList()));
        dto.setStockQuantity(product.getStockQuantity());
        dto.setInStock(product.getInStock());
        dto.setYoutubeLink(product.getYoutubeLink());
        dto.setColor(product.getColor());
        dto.setFabric(product.getFabric());
        dto.setDeleted(product.isDeleted());
        dto.setCreatedAt(product.getCreatedAt() != null ? product.getCreatedAt().toString() : null);
        return dto;
    }
}
