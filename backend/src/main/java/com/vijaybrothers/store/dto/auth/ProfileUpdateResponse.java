package com.vijaybrothers.store.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileUpdateResponse {
    private String token;
    private String message;
    private String user_image;
    private String profileImageUrl;
}
