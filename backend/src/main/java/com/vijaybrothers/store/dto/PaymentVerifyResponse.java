package com.vijaybrothers.store.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PaymentVerifyResponse {
    private String message;
    private String paymentId;
}
