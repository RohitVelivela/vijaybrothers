package com.vijaybrothers.store.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public record OrderCreateRequest(
    @NotNull(message = "guestId is required") Integer guestId,
    @NotEmpty(message = "items must not be empty") List<OrderItemRequest> items,
    @NotBlank(message = "shippingName is required") String shippingName,
    @Email  (message = "shippingEmail must be valid") @NotBlank(message = "shippingEmail is required") String shippingEmail,
    @NotBlank(message = "shippingPhone is required") String shippingPhone,
    @NotBlank(message = "shippingAddress is required") String shippingAddress,
    @NotBlank(message = "shippingCity is required") String shippingCity,
    @NotBlank(message = "shippingPostalCode is required") String shippingPostalCode,
    @NotBlank(message = "shippingState is required") String shippingState,
    @NotNull(message = "totalAmount is required") Double totalAmount
) {}
