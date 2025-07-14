package com.vijaybrothers.store.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AdminSignupRequest {
    
    @NotBlank(message = "Username is required")
    private String userName;

    @NotBlank(message = "Password is required")
    private String userPassword;

    private String userEmail;
}
