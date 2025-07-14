package com.vijaybrothers.store.dto.profile;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;

public class AdminProfileUpdateRequest {
    @JsonProperty("user_name")
    @NotBlank
    private String userName;

    @JsonProperty("user_email")
    @NotBlank @Email
    private String userEmail;

    @JsonProperty("user_image")
    private String userImage;

    @JsonProperty("is_password_changed")
    private boolean passwordChanged;

    @JsonProperty("old_password")
    private String oldPassword;

    @JsonProperty("new_password")
    private String newPassword;

    // getters & setters
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserImage() { return userImage; }
    public void setUserImage(String userImage) { this.userImage = userImage; }

    public boolean isPasswordChanged() { return passwordChanged; }
    public void setPasswordChanged(boolean passwordChanged) { this.passwordChanged = passwordChanged; }

    public String getOldPassword() { return oldPassword; }
    public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
