package com.vijaybrothers.store.dto;

import com.vijaybrothers.store.model.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Integer productId;
    private String name;
    private BigDecimal price;
    private String description;
    private Integer categoryId;
    private Boolean inStock;

    public static ProductDto fromEntity(Product product) {
        ProductDto dto = new ProductDto();
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setDescription(product.getDescription());
        dto.setCategoryId(product.getCategory() != null ? product.getCategory().getCategoryId() : null);
        dto.setInStock(product.getInStock());
        return dto;
    }
}
