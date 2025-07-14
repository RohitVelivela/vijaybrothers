package com.vijaybrothers.store.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.OffsetDateTime;

@Getter
@AllArgsConstructor
public class PaymentDetailDto {
    private Long paymentId;
    private Long orderId;
    private String status;
    private Long amount;
    private OffsetDateTime paidAt;
}
