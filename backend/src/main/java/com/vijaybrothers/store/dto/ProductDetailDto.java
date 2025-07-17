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
public class ProductDetailDto {
    private Integer productId;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer categoryId;
    private String categoryName;
    private Integer stockQuantity;
    private Boolean inStock;
    private String youtubeLink;
    private String mainImageUrl;
    private String color;
    private String fabric;
    private List<String> imageUrls;

    public static ProductDetailDto fromEntity(Product product) {
        ProductDetailDto dto = new ProductDetailDto();
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setInStock(product.getInStock());
        dto.setYoutubeLink(product.getYoutubeLink());
        dto.setMainImageUrl(product.getMainImageUrl());
        dto.setColor(product.getColor());
        dto.setFabric(product.getFabric());
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getCategoryId());
            dto.setCategoryName(product.getCategory().getName());
        }
        dto.setStockQuantity(product.getStockQuantity());
        dto.setInStock(product.getInStock());
        dto.setYoutubeLink(product.getYoutubeLink());
        dto.setMainImageUrl(product.getMainImageUrl());
        dto.setColor(product.getColor());
        dto.setFabric(product.getFabric());
        if (product.getImages() != null) {
            dto.setImageUrls(product.getImages().stream()
                .map(img -> img.getImageUrl())
                .collect(Collectors.toList()));
        }
        return dto;
    }
}
