package com.vijaybrothers.store.dto.login;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;

public class AdminLoginRequest {
    @JsonProperty("user_name")
    @NotBlank
    private String userName;

    @JsonProperty("user_password")
    @NotBlank
    private String userPassword;

    // getters & setters
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserPassword() { return userPassword; }
    public void setUserPassword(String userPassword) { this.userPassword = userPassword; }
}
