package com.vijaybrothers.store.dto.profile;

public class AdminProfileResponse {
    private String userName;
    private String userEmail;
    private String userImage;
    private String message;

    public AdminProfileResponse(String userName, String userEmail, String userImage, String message) {
        this.userName = userName;
        this.userEmail = userEmail;
        this.userImage = userImage;
        this.message = message;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserImage() {
        return userImage;
    }

    public void setUserImage(String userImage) {
        this.userImage = userImage;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}