package com.vijaybrothers.store.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequestDto {
    private Long orderId;
    private Long amount;
    private String receipt; 
}

