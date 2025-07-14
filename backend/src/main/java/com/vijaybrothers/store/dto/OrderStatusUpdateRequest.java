package com.vijaybrothers.store.dto;

import jakarta.validation.constraints.NotBlank;

public record OrderStatusUpdateRequest(
    @NotBlank String orderStatus,
    @NotBlank String paymentStatus
) {}
