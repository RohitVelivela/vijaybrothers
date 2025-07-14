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
}
