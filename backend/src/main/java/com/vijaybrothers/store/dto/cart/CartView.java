package com.vijaybrothers.store.dto.cart;

import java.math.BigDecimal;
import java.util.List;

public record CartView(
    String cartId,
    List<CartLine> lines,
    BigDecimal subtotal,
    BigDecimal grandTotal
) {
    public record CartLine(
        Integer cartItemId,
        Integer productId,
        String productCode,
        String name,
        String mainImageUrl,
        BigDecimal price,
        Integer quantity,
        BigDecimal lineTotal
    ) {}
}
