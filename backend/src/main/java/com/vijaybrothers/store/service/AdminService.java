package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.AdminProfileUpdateDTO;
import com.vijaybrothers.store.dto.auth.LoginRequest;
import com.vijaybrothers.store.dto.auth.LoginResponse;
import com.vijaybrothers.store.dto.auth.SignupRequest;
import com.vijaybrothers.store.dto.auth.SignupResponse;
import com.vijaybrothers.store.dto.auth.ProfileUpdateResponse;

public interface AdminService {
    SignupResponse signup(SignupRequest req);
    LoginResponse login(LoginRequest req);
    
    ProfileUpdateResponse updateUser(Long userId, AdminProfileUpdateDTO req);

    void forgotPassword(String email, String resetLinkBase);

    void resetPassword(String token, String newPassword);
}
