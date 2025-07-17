package com.vijaybrothers.store.dto;

import com.vijaybrothers.store.model.Product;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateProductRequest {
    private String productCode;
    private String name;
    private String description;
    private BigDecimal price;
    private Long categoryId;
    private Integer stockQuantity;
    private Boolean isInStock;
    private String youtubeLink;
    
    private String color;
    private String fabric;

    public Product toEntity() {
        Product product = new Product();
        product.setProductCode(productCode);
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        // Category will be set in service layer
        product.setStockQuantity(stockQuantity);
        product.setInStock(isInStock);
        product.setYoutubeLink(youtubeLink);
        
        product.setColor(color);
        product.setFabric(fabric);
        return product;
    }
}
