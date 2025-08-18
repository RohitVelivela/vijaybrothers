package com.vijaybrothers.store.controller.payments;

import com.vijaybrothers.store.dto.*;
import com.vijaybrothers.store.service.PaymentService;
import com.vijaybrothers.store.service.OrderService;
import jakarta.validation.Valid;
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
    
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getPaymentConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("razorpayKeyId", razorpayKeyId);
        
        // Add UPI configuration from payment service
        org.json.JSONObject paymentConfig = paymentService.getPaymentConfig();
        config.put("upiEnabled", paymentConfig.getBoolean("upiEnabled"));
        if (paymentConfig.has("upiId")) {
            config.put("upiId", paymentConfig.getString("upiId"));
        }
        if (paymentConfig.has("upiPhone")) {
            config.put("upiPhone", paymentConfig.getString("upiPhone"));
        }
        
        return ResponseEntity.ok(config);
    }

   @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createOrder(@RequestBody PaymentCreateRequest req) {
    try {
        
        // Validate amount
        if (req.getAmount() == null || req.getAmount().doubleValue() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid amount"));
        }
        
        // Validate amount is reasonable (not too high/low for live mode)
        double amountInRupees = req.getAmount().doubleValue();
        if (amountInRupees < 1 || amountInRupees > 500000) {
            return ResponseEntity.badRequest().body(Map.of("error", "Amount must be between ₹1 and ₹5,00,000"));
        }
        
        // Create Razorpay order directly
        PaymentRequestDto paymentRequest = new PaymentRequestDto();
        long amountInPaise = req.getAmount().longValue() * 100; // Convert to paise
        paymentRequest.setAmount(amountInPaise);
        // Use internal reference, not order_id
        String internalReceipt = "VB_PAYMENT_" + System.currentTimeMillis();
        paymentRequest.setReceipt(internalReceipt);
        
        String razorpayOrderId = paymentService.createPaymentOrder(paymentRequest);
        
        // Return minimal response - only orderId and key
        Map<String, String> response = new HashMap<>();
        response.put("orderId", razorpayOrderId);
        response.put("key", razorpayKeyId);
        
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", "Payment order creation failed: " + e.getMessage()));
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

    @GetMapping("/test-connection")
    public ResponseEntity<Map<String, Object>> testRazorpayConnection() {
        try {
            
            // Test with minimal order creation
            PaymentRequestDto testRequest = new PaymentRequestDto();
            testRequest.setAmount(100L); // ₹1 in paise
            testRequest.setReceipt("TEST_" + System.currentTimeMillis());
            
            String testOrderId = paymentService.createPaymentOrder(testRequest);
            
            Map<String, Object> result = new HashMap<>();
            result.put("status", "success");
            result.put("message", "Razorpay connection working");
            result.put("testOrderId", testOrderId);
            result.put("keyId", razorpayKeyId);
            result.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            
            Map<String, Object> result = new HashMap<>();
            result.put("status", "error");
            result.put("message", e.getMessage());
            result.put("errorType", e.getClass().getSimpleName());
            result.put("keyId", razorpayKeyId);
            result.put("keyType", razorpayKeyId.startsWith("rzp_live") ? "LIVE" : "TEST");
            result.put("timestamp", System.currentTimeMillis());
            
            // Add root cause if available
            Throwable cause = e.getCause();
            if (cause != null) {
                result.put("rootCause", cause.getMessage());
                result.put("rootCauseType", cause.getClass().getSimpleName());
            }
            
            return ResponseEntity.badRequest().body(result);
        }
    }
    
    @GetMapping("/diagnose-live")
    public ResponseEntity<Map<String, Object>> diagnoseLive() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            
            // Test 1: Check keys
            result.put("keyId", razorpayKeyId);
            result.put("keyType", razorpayKeyId.startsWith("rzp_live") ? "LIVE" : "TEST");
            result.put("keyLength", razorpayKeyId.length());
            
            // Test 2: Try different amounts
            PaymentRequestDto testRequest1 = new PaymentRequestDto();
            testRequest1.setAmount(100L); // ₹1
            testRequest1.setReceipt("DIAG1_" + System.currentTimeMillis());
            
            String orderId1 = paymentService.createPaymentOrder(testRequest1);
            result.put("test1_amount", "₹1");
            result.put("test1_status", "SUCCESS");
            result.put("test1_orderId", orderId1);
            
            PaymentRequestDto testRequest2 = new PaymentRequestDto();
            testRequest2.setAmount(10000L); // ₹100
            testRequest2.setReceipt("DIAG2_" + System.currentTimeMillis());
            
            String orderId2 = paymentService.createPaymentOrder(testRequest2);
            result.put("test2_amount", "₹100");
            result.put("test2_status", "SUCCESS");
            result.put("test2_orderId", orderId2);
            
            result.put("overallStatus", "SUCCESS");
            result.put("message", "All tests passed - Razorpay live mode is working!");
            
        } catch (Exception e) {
            
            result.put("overallStatus", "FAILED");
            result.put("error", e.getMessage());
            result.put("errorClass", e.getClass().getSimpleName());
            
            // Get root cause details
            Throwable cause = e.getCause();
            if (cause != null) {
                result.put("rootCause", cause.getMessage());
                result.put("rootCauseClass", cause.getClass().getSimpleName());
            }
            
            // Add troubleshooting hints
            String errorMsg = e.getMessage().toLowerCase();
            if (errorMsg.contains("authentication") || errorMsg.contains("key")) {
                result.put("hint", "Check if your Razorpay live keys are correct");
            } else if (errorMsg.contains("merchant") || errorMsg.contains("account")) {
                result.put("hint", "Your Razorpay account might not be fully activated for live mode");
            } else if (errorMsg.contains("amount") || errorMsg.contains("limit")) {
                result.put("hint", "Check transaction limits on your Razorpay account");
            }
        }
        
        return ResponseEntity.ok(result);
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentVerifyResponse> verifyPayment(@RequestBody PaymentVerifyRequest request) {
        try {
            PaymentVerifyResponse response = paymentService.verifyAndSave(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new PaymentVerifyResponse("Payment verification failed: " + e.getMessage(), null));
        }
    }
    
    // Endpoint from PaymentWebhookController - consolidated here
    @PostMapping("/create-order")
    public ResponseEntity<?> createPaymentOrder(@Valid @RequestBody PaymentRequestDto dto) {
        String orderId = paymentService.createPaymentOrder(dto);
        return ResponseEntity.ok(orderId);
    }
    
    @PostMapping("/webhook")
public ResponseEntity<String> handleWebhook(
        @RequestBody String payload,
        @RequestHeader("X-Razorpay-Signature") String signature) {  // ADD signature header
    
    paymentService.handleWebhook(payload, signature);  // Pass both parameters
    return ResponseEntity.ok("Webhook received");
}
}
