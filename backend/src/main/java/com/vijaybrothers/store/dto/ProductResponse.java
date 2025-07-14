package com.vijaybrothers.store.dto;

import java.math.BigDecimal;
import java.util.List;

public record ProductResponse(
        Integer      productId,
        String       productCode,
        String       name,
        BigDecimal   price,
        Boolean      inStock,
        List<String> imageUrls
) {}
