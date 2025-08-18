package com.vijaybrothers.store.dto.shipping;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductShippingDto {
    private Integer shippingId;
    private Integer productId;
    private String productName;
    private String productCode;
    private Boolean hasFreeShipping;
    private BigDecimal shippingCharge;
    private Boolean isHeavyItem;
    private BigDecimal additionalCharge;
    private String productImage;
    private BigDecimal productPrice;
}