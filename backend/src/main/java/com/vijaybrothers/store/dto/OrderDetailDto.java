package com.vijaybrothers.store.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderDetailDto(
    Integer orderId,
    String orderNumber,
    BigDecimal totalAmount,
    String orderStatus,
    String paymentStatus,
    Instant createdAt,
    String shippingName,
    String shippingEmail,
    String shippingPhone,
    String shippingAddress,
    String paymentMethod,
    List<OrderItemDto> orderItems
) {}
