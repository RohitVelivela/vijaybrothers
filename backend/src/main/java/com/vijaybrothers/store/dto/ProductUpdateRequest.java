package com.vijaybrothers.store.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdateRequest {
    private Integer productId;
    private String productCode;
    private String name;
    @Size(max = 2000)
    private String description;
    @Positive
    private BigDecimal price;
    private Integer categoryId;
    @Min(0)
    private Integer stockQuantity;
    private Boolean inStock;
    private String youtubeLink;

    // Getters
    public Integer getProductId() { return productId; }
    public String getProductCode() { return productCode; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public Integer getCategoryId() { return categoryId; }
    public Integer getStockQuantity() { return stockQuantity; }
    public Boolean getInStock() { return inStock; }
    public String getYoutubeLink() { return youtubeLink; }

    // Setters
    public void setProductId(Integer productId) { this.productId = productId; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }
    public void setYoutubeLink(String youtubeLink) { this.youtubeLink = youtubeLink; }

    private List<MultipartFile> productImages;

    public List<MultipartFile> getProductImages() {
        return productImages;
    }

    public void setProductImages(List<MultipartFile> productImages) {
        this.productImages = productImages;
    }
}