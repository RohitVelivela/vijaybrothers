package com.vijaybrothers.store.controller;

import java.math.BigDecimal;
import com.vijaybrothers.store.dto.OrderCreateRequest;
import com.vijaybrothers.store.dto.PlaceOrderResponse;
import com.vijaybrothers.store.dto.OrderSummaryDto;
import com.vijaybrothers.store.dto.OrderTrackDto;
import com.vijaybrothers.store.service.OrderService;
import com.vijaybrothers.store.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final PaymentService paymentService;

    /**
     * Place a new order.
     */
    @PostMapping
    public ResponseEntity<PlaceOrderResponse> placeOrder(
            @Valid @RequestBody OrderCreateRequest request) {
        PlaceOrderResponse response = orderService.placeOrder(request);
        return ResponseEntity.status(201).body(response);
    }

    /**
     * List orders by guest ID (paginated).
     */
    @GetMapping("/guest/{guestId}")
    public ResponseEntity<Page<OrderSummaryDto>> getGuestOrders(
            @PathVariable Long guestId,
            Pageable pageable) {
        Page<OrderSummaryDto> page = orderService.getGuestOrders(guestId, pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * Track a single order by order ID.
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderTrackDto> trackOrder(
            @PathVariable Long orderId) {
        OrderTrackDto dto = orderService.trackOrder(orderId);
        return ResponseEntity.ok(dto);
    }

    
}
