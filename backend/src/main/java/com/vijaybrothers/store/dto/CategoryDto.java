package com.vijaybrothers.store.dto;

import com.vijaybrothers.store.model.Category;
import java.time.Instant;

public record CategoryDto(
    Integer categoryId,
    String name,
    String slug,
    String description,
    Instant createdAt
) {
    public static CategoryDto from(Category c) {
        return new CategoryDto(
            c.getCategoryId(),
            c.getName(),
            c.getSlug(),
            c.getDescription(),
            c.getCreatedAt()
        );
    }
}