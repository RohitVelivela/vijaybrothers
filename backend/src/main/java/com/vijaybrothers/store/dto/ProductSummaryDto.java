package com.vijaybrothers.store.dto;

import java.math.BigDecimal;

public record ProductSummaryDto(
    Integer productId,
    String productCode,
    String name,
    String mainImageUrl,
    BigDecimal price,
    Boolean inStock,
    Integer stockQuantity,
    Integer categoryId,
    boolean deleted,
    String createdAt
) {}
