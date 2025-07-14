package com.vijaybrothers.store.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record OrderItemRequest(
    @NotNull(message = "productId is required") Long productId,
    @NotBlank(message = "productName is required") String productName,
    @NotNull(message = "quantity is required") @Min(value = 1, message = "quantity must be ≥ 1") Integer quantity,
    @NotNull(message = "unitPrice is required") @DecimalMin(value = "0.0", message = "unitPrice must be ≥ 0") BigDecimal unitPrice,
    @NotNull(message = "subTotal is required") @DecimalMin(value = "0.0", message = "subTotal must be ≥ 0") BigDecimal subTotal
) {}
