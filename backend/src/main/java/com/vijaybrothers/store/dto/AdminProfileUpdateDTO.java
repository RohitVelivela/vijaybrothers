package com.vijaybrothers.store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminProfileUpdateDTO {
    private String userName;
    private String email;
    private MultipartFile profileImage; // For new image upload
    private boolean removeProfileImage; // To indicate if the existing image should be removed
    private String oldPassword;
    private String newPassword;
}
