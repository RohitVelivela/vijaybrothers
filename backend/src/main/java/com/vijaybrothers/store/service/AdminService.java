package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.auth.LoginRequest;
import com.vijaybrothers.store.dto.auth.LoginResponse;
import com.vijaybrothers.store.dto.auth.SignupRequest;
import com.vijaybrothers.store.dto.auth.SignupResponse;
import com.vijaybrothers.store.dto.auth.ProfileUpdateRequest;
import com.vijaybrothers.store.dto.auth.ProfileUpdateResponse;

public interface AdminService {
    SignupResponse signup(SignupRequest req);
    LoginResponse login(LoginRequest req);
    ProfileUpdateResponse updateProfile(String currentUserName, ProfileUpdateRequest req);
}
