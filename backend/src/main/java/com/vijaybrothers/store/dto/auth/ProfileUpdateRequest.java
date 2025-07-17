package com.vijaybrothers.store.dto.auth;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class ProfileUpdateRequest {
    private String user_name;
    private String user_email;
    private MultipartFile user_image;
    private Boolean is_password_changed;
    private String old_password;
    private String new_password;
    private Boolean remove_profile_image; // New field

    // Getters
    public String getUserName() { return user_name; }
    public String getUserEmail() { return user_email; }
    public MultipartFile getUserImage() { return user_image; }
    public Boolean getIsPasswordChanged() { return is_password_changed; }
    public String getOldPassword() { return old_password; }
    public String getNewPassword() { return new_password; }
    public Boolean getRemoveProfileImage() { return remove_profile_image; }

    // Setters
    public void setUserName(String user_name) { this.user_name = user_name; }
    public void setUserEmail(String user_email) { this.user_email = user_email; }
    public void setUserImage(MultipartFile user_image) { this.user_image = user_image; }
    public void setIsPasswordChanged(Boolean is_password_changed) { this.is_password_changed = is_password_changed; }
    public void setOldPassword(String old_password) { this.old_password = old_password; }
    public void setNewPassword(String new_password) { this.new_password = new_password; }
    public void setRemoveProfileImage(Boolean remove_profile_image) { this.remove_profile_image = remove_profile_image; }
}
