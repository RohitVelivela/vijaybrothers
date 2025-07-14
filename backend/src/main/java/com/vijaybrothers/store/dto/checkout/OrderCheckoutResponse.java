package com.vijaybrothers.store.dto.checkout;

/**
 * DTO returned after creating an order from guest checkout.
 */
public record OrderCheckoutResponse(
    Integer orderId,
    String orderNumber,
    String paymentSessionUrl
) {}