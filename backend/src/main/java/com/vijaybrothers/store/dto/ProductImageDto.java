package com.vijaybrothers.store.dto;

public record ProductImageDto(
    Integer id,
    String imageUrl,
    boolean isMain
) {}
