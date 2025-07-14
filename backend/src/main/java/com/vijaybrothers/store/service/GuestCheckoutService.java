package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.checkout.GuestCheckoutRequest;
import com.vijaybrothers.store.dto.checkout.GuestCheckoutResponse;

/**
 * Service for guest checkout operations.
 */
public interface GuestCheckoutService {
    
    /**
     * Create or update guest checkout details for a given cartId.
     */
    GuestCheckoutResponse createGuest(String cartId, GuestCheckoutRequest request);
    
    /**
     * Retrieve previously saved guest details by guestId.
     */
    GuestCheckoutResponse getGuest(String guestId);
}