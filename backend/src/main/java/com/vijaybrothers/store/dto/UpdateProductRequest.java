package com.vijaybrothers.store.dto;

import com.vijaybrothers.store.model.Product;
import lombok.Data;
import java.math.BigDecimal;

public class UpdateProductRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private Boolean isInStock;
    private String youtubeLink;
    
    private String color;
    private String fabric;

    // Getters
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public Integer getStockQuantity() { return stockQuantity; }
    public Boolean getIsInStock() { return isInStock; }
    public String getYoutubeLink() { return youtubeLink; }
    
    public String getColor() { return color; }
    public String getFabric() { return fabric; }

    // Setters
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    public void setIsInStock(Boolean isInStock) { this.isInStock = isInStock; }
    public void setYoutubeLink(String youtubeLink) { this.youtubeLink = youtubeLink; }
    
    public void setColor(String color) { this.color = color; }
    public void setFabric(String fabric) { this.fabric = fabric; }

    public void updateEntity(Product product) {
        product.setName(this.name);
        product.setDescription(this.description);
        product.setPrice(this.price);
        product.setStockQuantity(this.stockQuantity);
        product.setInStock(this.isInStock);
        product.setYoutubeLink(this.youtubeLink);
        product.setColor(this.color);
        product.setFabric(this.fabric);
    }
}