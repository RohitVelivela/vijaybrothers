package com.vijaybrothers.store.dto;

import jakarta.validation.constraints.*;

public record ContactFormRequest(
    @NotBlank(message="Name is required")    String name,
    @Email   (message="Must be a valid email") String email,
    @NotBlank(message="Phone is required")   String phone,
    @NotBlank(message="Message is required") String message
) {}