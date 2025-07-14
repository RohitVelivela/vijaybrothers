package com.vijaybrothers.store.dto;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record OrderSummaryDto(
    Long orderId,
    String orderNumber,
    BigDecimal totalAmount,
    String status,
    ZonedDateTime createdAt
) {}