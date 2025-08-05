package com.vijaybrothers.store.controller.payments;

import com.vijaybrothers.store.dto.*;
import com.vijaybrothers.store.service.PaymentService;
import com.vijaybrothers.store.service.OrderService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

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
    public ResponseEntity<Map<String, String>> createOrder(@RequestBody PaymentCreateRequest req) {
    try {
        System.out.println("Creating payment order with amount: " + req.getAmount());
        
        // Create Razorpay order directly
        PaymentRequestDto paymentRequest = new PaymentRequestDto();
        paymentRequest.setAmount(req.getAmount().longValue() * 100); // Convert to paise
        paymentRequest.setReceipt(req.getReceipt());
        
        String razorpayOrderId = paymentService.createPaymentOrder(paymentRequest);
        
        System.out.println("Razorpay order created: " + razorpayOrderId);
        
        // Return the order ID for frontend
        Map<String, String> response = new HashMap<>();
        response.put("orderId", razorpayOrderId);
        response.put("razorpayOrderId", razorpayOrderId);
        response.put("currency", req.getCurrency());
        response.put("amount", req.getAmount().toString());
        
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        e.printStackTrace();  // TEMP: Log error
        System.err.println("Error creating payment order: " + e.getMessage());
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
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

    @PostMapping("/verify")
    public ResponseEntity<PaymentVerifyResponse> verifyPayment(@RequestBody PaymentVerifyRequest request) {
        try {
            PaymentVerifyResponse response = paymentService.verifyAndSave(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // TEMP: Log error
            return ResponseEntity.badRequest().body(new PaymentVerifyResponse("Payment verification failed: " + e.getMessage(), null));
        }
    }
}
