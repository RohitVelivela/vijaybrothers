package com.vijaybrothers.store.dto;

import com.vijaybrothers.store.model.Product;
import java.math.BigDecimal;

public record ProductListItem(
        Integer productId,
        String  productCode,
        String  name,
        BigDecimal price,
        Boolean inStock,
        String  youtubeLink,
        String  categoryName,
        String  color,
        String  fabric
) {
    public static ProductListItem from(Product p) {
        return new ProductListItem(
            p.getProductId(),
            p.getProductCode(),
            p.getName(),
            p.getPrice(),
            p.getInStock(),
            p.getYoutubeLink(),
            p.getCategory() != null ? p.getCategory().getName() : null,
            p.getColor(),
            p.getFabric()
        );
    }
    public Integer getProductId() { return productId; }
    public String getProductCode() { return productCode; }
    public String getName() { return name; }
    public BigDecimal getPrice() { return price; }
    public Boolean getInStock() { return inStock; }
    public String getYoutubeLink() { return youtubeLink; }
    public String getCategoryName() { return categoryName; }
    public String getColor() { return color; }
    public String getFabric() { return fabric; }
}
