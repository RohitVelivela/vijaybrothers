package com.vijaybrothers.store.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

public class PaymentVerifyResponse {
    private String message;
    private String paymentId;

    public PaymentVerifyResponse(String message, String paymentId) {
        this.message = message;
        this.paymentId = paymentId;
    }
}
