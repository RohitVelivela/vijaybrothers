package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.checkout.GuestCheckoutRequest;
import com.vijaybrothers.store.dto.checkout.GuestCheckoutResponse;
import com.vijaybrothers.store.dto.checkout.OrderCheckoutResponse;
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

    /**
     * POST /api/checkout/guest/order
     * Create an order for a guest user.
     */
    @PostMapping("/guest/order")
    public ResponseEntity<OrderCheckoutResponse> guestCheckout(
            @RequestParam Integer cartId,
            @Valid @RequestBody GuestCheckoutRequest request
    ) {
        OrderCheckoutResponse response = checkoutService.guestCheckout(cartId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/checkout/order/{guestId}
     * Create an order using existing guest details.
     */
    @PostMapping("/order/{guestId}")
    public ResponseEntity<OrderCheckoutResponse> createOrderFromGuest(
            @PathVariable Integer guestId,
            @RequestParam Integer cartId
    ) {
        OrderCheckoutResponse response = checkoutService.createOrderFromGuest(guestId, cartId);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/checkout/smart-order
     * Create an order intelligently - use existing guest details if available, otherwise create new ones.
     */
    @PostMapping("/smart-order")
    public ResponseEntity<OrderCheckoutResponse> smartCheckout(
            @RequestParam Integer cartId,
            @Valid @RequestBody GuestCheckoutRequest request
    ) {
        OrderCheckoutResponse response = checkoutService.smartCheckout(cartId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/checkout/simple-order
     * Create an order directly without guest complexity.
     */
    @PostMapping("/simple-order")
    public ResponseEntity<OrderCheckoutResponse> simpleCheckout(
            @RequestParam Integer cartId,
            @Valid @RequestBody GuestCheckoutRequest request
    ) {
        OrderCheckoutResponse response = checkoutService.simpleCheckout(cartId, request);
        return ResponseEntity.ok(response);
    }
}
