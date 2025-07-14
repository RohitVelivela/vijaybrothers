package com.vijaybrothers.store.dto.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartItemRequest(
    @NotNull Integer productId,
    @Min(1) int quantity
) {}
