package com.vijaybrothers.store.dto.checkout;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/**
 * DTO for capturing guest checkout details.
 */
public record GuestCheckoutRequest(
    @NotNull(message = "Cart ID is required")
    Integer cartId,

    @NotBlank(message = "Name is required")
    String name,
    
    @Email(message = "Must be a valid email")
    String email,
    
    @Pattern(regexp="^\\d{10}$", message="Phone must be 10 digits")
    String phone,
    
    @NotBlank(message = "Address is required")
    String address,
    
    @NotBlank(message = "City is required")
    String city,
    
    @NotBlank(message = "State is required")
    String state,
    
    @NotBlank(message = "Postal code is required")
    String postalCode
) {}
