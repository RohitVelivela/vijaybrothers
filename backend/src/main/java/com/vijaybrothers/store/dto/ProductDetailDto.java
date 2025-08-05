package com.vijaybrothers.store.dto;

import com.vijaybrothers.store.model.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailDto {
    private Integer productId;
    private String productCode;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer categoryId;
    private String categoryName;
    private Integer stockQuantity;
    private Boolean inStock;
    private String youtubeLink;
    
    private String color;
    private String fabric;
    private List<String> imageUrls;

    // Getters
    public Integer getProductId() { return productId; }
    public String getProductCode() { return productCode; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public Integer getCategoryId() { return categoryId; }
    public String getCategoryName() { return categoryName; }
    public Integer getStockQuantity() { return stockQuantity; }
    public Boolean getInStock() { return inStock; }
    public String getYoutubeLink() { return youtubeLink; }
    public String getColor() { return color; }
    public String getFabric() { return fabric; }
    public List<String> getImageUrls() { return imageUrls; }

    // Setters
    public void setProductId(Integer productId) { this.productId = productId; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }
    public void setYoutubeLink(String youtubeLink) { this.youtubeLink = youtubeLink; }
    public void setColor(String color) { this.color = color; }
    public void setFabric(String fabric) { this.fabric = fabric; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }

    public static ProductDetailDto fromEntity(Product product) {
        ProductDetailDto dto = new ProductDetailDto();
        dto.setProductId(product.getProductId());
        dto.setProductCode(product.getProductCode());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setInStock(product.getInStock());
        dto.setYoutubeLink(product.getYoutubeLink());
        dto.setColor(product.getColor());
        dto.setFabric(product.getFabric());
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getCategoryId());
            dto.setCategoryName(product.getCategory().getName());
        }
        if (product.getImages() != null) {
            dto.setImageUrls(product.getImages().stream()
                .map(img -> img.getImageUrl())
                .collect(Collectors.toList()));
        }
        return dto;
    }
}
