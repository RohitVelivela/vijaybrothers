package com.vijaybrothers.store.dto.cart;

import jakarta.validation.constraints.Min;

/**
 * Request to change the quantity of a cart line.
 * A quantity of 0 will delete the line.
 */
public record CartUpdateRequest(
    @Min(0) int quantity
) {}
