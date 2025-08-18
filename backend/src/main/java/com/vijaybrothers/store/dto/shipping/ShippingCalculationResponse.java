package com.vijaybrothers.store.dto.shipping;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingCalculationResponse {
    private BigDecimal shippingCharge;
    private Boolean freeShipping;
    private BigDecimal minOrderForFreeShipping;
    private String message;
}