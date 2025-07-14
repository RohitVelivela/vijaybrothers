package com.vijaybrothers.store.dto;

import java.math.BigDecimal;

public record OrderItemDto(
    Integer productId,
    String productName,
    Integer quantity,
    BigDecimal unitPrice,
    BigDecimal subTotal
) {}
