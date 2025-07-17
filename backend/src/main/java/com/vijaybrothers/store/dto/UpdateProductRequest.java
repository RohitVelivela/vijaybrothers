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
        product.setName(this.name);
        product.setDescription(this.description);
        product.setPrice(this.price);
        product.setStockQuantity(this.stockQuantity);
        product.setInStock(this.isInStock);
        product.setYoutubeLink(this.youtubeLink);
        product.setMainImageUrl(this.mainImageUrl);
        product.setColor(this.color);
        product.setFabric(this.fabric);
    }
}
