package com.vijaybrothers.store.dto;

import java.time.Instant;

public record GuestInfoDto(
    Integer guestId,
    String name,
    String email,
    String phone,
    String address,
    Instant createdAt,
    Instant updatedAt
) {}