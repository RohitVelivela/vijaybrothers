package com.vijaybrothers.store.dto;

import jakarta.validation.constraints.*;

public record CategoryRequest(
  @NotBlank @Size(max = 255) String name,
  @NotBlank @Size(max = 255) String slug,
  String description
) {}