package com.vijaybrothers.store.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PlaceOrderResponse {
    private Long orderId;
    private String currency;
    private Double amount;
    private String message;
    private String transactionId;
}
