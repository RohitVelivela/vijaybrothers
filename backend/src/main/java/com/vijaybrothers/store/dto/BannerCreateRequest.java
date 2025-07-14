package com.vijaybrothers.store.dto;

import jakarta.validation.constraints.NotBlank;

public record BannerCreateRequest(
    @NotBlank(message="imageUrl is required") String imageUrl,
    @NotBlank(message="linkTo is required")  String linkTo
) {}