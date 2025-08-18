package com.vijaybrothers.store.dto.shipping;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingConfigDto {
    private Integer configId;
    private Boolean globalFreeShipping;
    private BigDecimal defaultShippingCharge;
    private BigDecimal minOrderForFreeShipping;
    private String updatedBy;
}