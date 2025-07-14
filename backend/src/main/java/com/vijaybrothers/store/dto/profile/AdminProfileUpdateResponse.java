package com.vijaybrothers.store.dto.profile;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminProfileUpdateResponse {
    @JsonProperty("token")
    private String token;

    @JsonProperty("user_image")
    private String userImage;

    @JsonProperty("message")
    private String message;

    public AdminProfileUpdateResponse(String token, String userImage) {
        this.token = token;
        this.userImage = userImage;
    }

    public AdminProfileUpdateResponse(String token, String userImage, String message) {
        this.token = token;
        this.userImage = userImage;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public String getUserImage() {
        return userImage;
    }

    public String getMessage() {
        return message;
    }
}
