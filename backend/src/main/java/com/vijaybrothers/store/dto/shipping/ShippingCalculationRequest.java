package com.vijaybrothers.store.dto.shipping;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingCalculationRequest {
    private List<Integer> productIds;
    private BigDecimal orderTotal;
}