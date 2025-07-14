package com.vijaybrothers.store.dto;

import com.vijaybrothers.store.model.Product;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class UpdateProductRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private Boolean isInStock;
    private String youtubeLink;
    private String mainImageUrl;
    private String color;
    private String fabric;

    public void updateEntity(Product product) {
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStockQuantity(stockQuantity);
        product.setInStock(isInStock);
        product.setYoutubeLink(youtubeLink);
        product.setMainImageUrl(mainImageUrl);
        product.setColor(color);
        product.setFabric(fabric);
    }
}
