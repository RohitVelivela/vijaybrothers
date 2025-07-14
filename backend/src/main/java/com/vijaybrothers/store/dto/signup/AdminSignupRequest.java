package com.vijaybrothers.store.dto.signup;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;

public class AdminSignupRequest {
    @JsonProperty("user_name")
    @NotBlank(message = "Username is required")
    private String userName;

    @JsonProperty("user_email")
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String userEmail;

    @JsonProperty("user_password")
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String userPassword;

    // getters & setters
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserPassword() { return userPassword; }
    public void setUserPassword(String userPassword) { this.userPassword = userPassword; }
}
