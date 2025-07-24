package com.vijaybrothers.store.dto;

import jakarta.validation.constraints.*;

public record ContactFormRequest(
    @NotBlank(message="Name is required")    String name,
    @Email   (message="Must be a valid email") String email,
    @NotBlank(message="Subject is required") String subject,
    @NotBlank(message="Message is required") String message,
    @NotBlank(message="Contact number is required") @Pattern(regexp="^\\d{10}$", message="Contact number must be 10 digits") String contactNo
) {}