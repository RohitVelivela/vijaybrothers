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
        dto.color = product.getColor();
        dto.fabric = product.getFabric();
        dto.deleted = product.isDeleted();
        dto.createdAt = product.getCreatedAt() != null ? product.getCreatedAt().toString() : null;
        return dto;
    }

    // Explicit setters for fields that Lombok might not be generating correctly
    public void setColor(String color) {
        this.color = color;
    }

    public void setFabric(String fabric) {
        this.fabric = fabric;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
