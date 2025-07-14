package com.vijaybrothers.store.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentVerificationDto {
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;
}
