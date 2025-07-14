package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.PaymentRequestDto;
import com.vijaybrothers.store.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentWebhookController {

    private final PaymentService paymentService;

    public PaymentWebhookController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createPaymentOrder(@Valid @RequestBody PaymentRequestDto dto) {
        String orderId = paymentService.createPaymentOrder(dto);
        return ResponseEntity.ok(orderId);
    }


    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload) {
        paymentService.handleWebhook(payload);
        return ResponseEntity.ok("Webhook received");
    }
}
