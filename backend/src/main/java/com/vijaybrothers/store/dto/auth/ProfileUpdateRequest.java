package com.vijaybrothers.store.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileUpdateRequest {
    private String user_name;
    private String user_email;
    private String user_image;
    private Boolean is_password_changed;
    private String old_password;
    private String new_password;
}
