package com.vijaybrothers.store.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

public class PlaceOrderResponse {
    private Long orderId;
    private String currency;
    private Double amount;
    private String message;
    private String transactionId;

    public PlaceOrderResponse(Long orderId, String currency, Double amount, String message, String transactionId) {
        this.orderId = orderId;
        this.currency = currency;
        this.amount = amount;
        this.message = message;
        this.transactionId = transactionId;
    }

    public Long getOrderId() {
        return orderId;
    }
}
