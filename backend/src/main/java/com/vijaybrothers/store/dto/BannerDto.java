package com.vijaybrothers.store.dto;

import java.time.Instant;

public record BannerDto(
    Integer id,
    String name,
    String image,
    String linkTo,
    String status,
    Instant createdAt,
    Instant updatedAt
) {}
