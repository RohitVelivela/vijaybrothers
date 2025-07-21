package com.vijaybrothers.store.dto;

import java.time.Instant;

public record BannerDto(
    Integer id,
    String name,
    String image,
    String linkTo,
    String status,
    Boolean isActive,
    String description,
    Instant createdAt,
    Instant updatedAt
) {}
