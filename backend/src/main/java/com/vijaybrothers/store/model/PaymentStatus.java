package com.vijaybrothers.store.model;
public enum PaymentStatus {
    PENDING,    // Initial state when order is created
    PAID,       // Payment successful
    FAILED,     // Payment attempt failed
    REFUNDED    // Payment was refunded to customer
}