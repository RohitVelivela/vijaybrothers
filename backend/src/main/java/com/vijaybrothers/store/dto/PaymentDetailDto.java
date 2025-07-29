package com.vijaybrothers.store.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.OffsetDateTime;

public class PaymentDetailDto {
    private Long paymentId;
    private Long orderId;
    private String status;
    private Long amount;
    private OffsetDateTime paidAt;

    public PaymentDetailDto(Long paymentId, Long orderId, String status, Long amount, OffsetDateTime paidAt) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.status = status;
        this.amount = amount;
        this.paidAt = paidAt;
    }
}
