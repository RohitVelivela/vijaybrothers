package com.vijaybrothers.store.dto;

import java.time.Instant;

public record StaticPageDto(
    String  slug,
    String  title,
    String  content,
    Instant updatedAt
) {}