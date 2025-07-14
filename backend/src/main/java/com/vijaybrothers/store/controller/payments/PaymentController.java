package com.vijaybrothers.store.controller.payments;

import com.vijaybrothers.store.dto.*;
import com.vijaybrothers.store.service.PaymentService;
import com.vijaybrothers.store.service.OrderService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;
    private final String razorpayKeyId;

    public PaymentController(PaymentService paymentService, OrderService orderService, @Value("${razorpay.key_id}") String razorpayKeyId) {
        this.paymentService = paymentService;
        this.orderService = orderService;
        this.razorpayKeyId = razorpayKeyId;
    }

   @PostMapping("/create")
    public ResponseEntity<PlaceOrderResponse> createOrder(@RequestBody PaymentCreateRequest req) {
    try {
        // Convert PaymentCreateRequest to OrderCreateRequest
        OrderCreateRequest orderCreateRequest = new OrderCreateRequest(
            1, // guestId: Placeholder, replace with actual guest ID logic
            java.util.Collections.emptyList(), // items: Placeholder, replace with actual order items
            "Dummy Name", // shippingName: Placeholder
            "dummy@example.com", // shippingEmail: Placeholder
            "1234567890", // shippingPhone: Placeholder
            "Dummy Address", // shippingAddress: Placeholder
            "Dummy City", // shippingCity: Placeholder
            "12345", // shippingPostalCode: Placeholder
            "Dummy State", // shippingState: Placeholder
            req.getAmount().doubleValue()
        );

        PlaceOrderResponse response = orderService.placeOrder(orderCreateRequest);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        e.printStackTrace();  // TEMP: Log error
        return ResponseEntity.badRequest().body(null);
    }
}

    @GetMapping("/{orderId}")
    public ResponseEntity<PaymentDetailDto> getDetails(@PathVariable Long orderId) {
        PaymentDetailDto dto = paymentService.fetchDetails(orderId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/key")
    public ResponseEntity<String> getKey() {
        return ResponseEntity.ok(razorpayKeyId);
    }
}
