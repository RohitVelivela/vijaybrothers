package com.vijaybrothers.store.dto.login;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminLoginResponse {
    @JsonProperty("token")
    private String token;

    @JsonProperty("message")
    private String message;

    public AdminLoginResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public String getMessage() {
        return message;
    }
}
