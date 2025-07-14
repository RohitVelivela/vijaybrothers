package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.checkout.GuestCheckoutRequest;
import com.vijaybrothers.store.dto.checkout.GuestCheckoutResponse;
import com.vijaybrothers.store.service.CheckoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * Controller for guest checkout operations.
 */
@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;

    /**
     * POST /api/checkout/guest
     * Create guest details and link cart items.
     */
    @PostMapping("/guest")
    public ResponseEntity<?> createGuest(
            @Valid @RequestBody GuestCheckoutRequest request
    ) {
        checkoutService.createGuest(request.cartId(), request);
        return ResponseEntity.ok(Map.of("message", "guest added successfully"));
    }

    /**
     * GET /api/checkout/guest/{guestId}
     * Fetch saved guest details.
     */
    @GetMapping("/guest/{guestId}")
    public ResponseEntity<GuestCheckoutResponse> getGuest(
            @PathVariable Integer guestId
    ) {
        return ResponseEntity.ok(checkoutService.getGuest(guestId));
    }
}
