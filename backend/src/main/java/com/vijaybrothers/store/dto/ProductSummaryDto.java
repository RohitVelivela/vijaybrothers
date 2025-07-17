package com.vijaybrothers.store.dto;

import java.math.BigDecimal;
import java.util.List;

public record ProductSummaryDto(
    Integer productId,
    String productCode,
    String name,
    List<ProductImageDto> images,
    BigDecimal price,
    Boolean inStock,
    Integer stockQuantity,
    Integer categoryId,
    boolean deleted,
    String createdAt
) {}
