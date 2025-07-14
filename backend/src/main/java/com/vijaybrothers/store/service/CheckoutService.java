package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.checkout.GuestCheckoutRequest;
import com.vijaybrothers.store.dto.checkout.GuestCheckoutResponse;
import com.vijaybrothers.store.dto.checkout.OrderCheckoutResponse;

/**
 * Service for checkout operations.
 */
public interface CheckoutService {
    
    /**
     * Create or update guest checkout details for a given cartId.
     */
    GuestCheckoutResponse createGuest(Integer cartId, GuestCheckoutRequest request);
    
    /**
     * Retrieve previously saved guest details by guestId.
     */
    GuestCheckoutResponse getGuest(Integer guestId);
    
    /**
     * Create an order from guest checkout details.
     */
    OrderCheckoutResponse guestCheckout(Integer cartId, GuestCheckoutRequest req);
}