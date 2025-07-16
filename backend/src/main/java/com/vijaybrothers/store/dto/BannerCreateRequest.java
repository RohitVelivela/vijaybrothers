package com.vijaybrothers.store.dto;

import jakarta.validation.constraints.NotBlank;

public record BannerCreateRequest(
    @NotBlank(message="name is required") String name,
    @NotBlank(message="image is required") String image,
    @NotBlank(message="linkTo is required")  String linkTo
) {}