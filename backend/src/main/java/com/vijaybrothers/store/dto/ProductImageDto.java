package com.vijaybrothers.store.dto;

import com.vijaybrothers.store.model.ProductImage;

public record ProductImageDto(
    Long id,
    String imageUrl,
    boolean isMain
) {
    public static ProductImageDto from(ProductImage image) {
        return new ProductImageDto(
            image.getId(),
            image.getImageUrl(),
            image.isMain()
        );
    }
}
