package com.vijaybrothers.store.dto;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

public record OrderTrackDto(
    Long orderId,
    String orderNumber,
    BigDecimal totalAmount,
    String status,
    ZonedDateTime createdAt,
    String shippingName,
    String shippingAddress,
    String shippingCity,
    String shippingPostalCode,
    String shippingState,
    List<OrderItemDetail> items
) {
    public record OrderItemDetail(
        Long productId,
        String productName,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal
    ) {}
}
