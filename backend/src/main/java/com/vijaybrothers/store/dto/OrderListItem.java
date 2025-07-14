package com.vijaybrothers.store.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderListItem(
        Integer     orderId,
        String      orderNumber,
        String      customerName,
        BigDecimal  totalAmount,
        String      paymentStatus,
        String      orderStatus,
        Instant     createdAt
) {}
