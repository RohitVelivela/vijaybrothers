package com.vijaybrothers.store.dto.checkout;

import java.time.OffsetDateTime;

/**
 * DTO returned after saving or retrieving guest checkout details.
 */
public record GuestCheckoutResponse(
    Integer guestId,
    String name,
    String email,
    String phone,
    String address,
    String city,
    String state,
    String postalCode,
    OffsetDateTime createdAt
) {
    public static GuestCheckoutResponse fromEntity(
            com.vijaybrothers.store.model.GuestCheckoutDetails entity) {
        return new GuestCheckoutResponse(
            entity.getGuestId(),
            entity.getName(),
            entity.getEmail(),
            entity.getPhone(),
            entity.getAddress(),
            entity.getCity(),
            entity.getState(),
            entity.getPostalCode(),
            entity.getCreatedAt()
        );
    }
}