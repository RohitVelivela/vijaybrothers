package com.vijaybrothers.store.dto;

import jakarta.validation.constraints.NotBlank;

public record SeoUpdateRequest(
    @NotBlank(message = "metaTitle is required")    String metaTitle,
    @NotBlank(message = "metaDesc is required")     String metaDesc,
    @NotBlank(message = "metaKeywords is required") String metaKeywords
) {}