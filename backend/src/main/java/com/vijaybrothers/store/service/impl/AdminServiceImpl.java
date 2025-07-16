package com.vijaybrothers.store.service.impl;

import com.vijaybrothers.store.dto.auth.LoginRequest;
import com.vijaybrothers.store.dto.auth.LoginResponse;
import com.vijaybrothers.store.dto.auth.SignupRequest;
import com.vijaybrothers.store.dto.auth.SignupResponse;
import com.vijaybrothers.store.dto.auth.ProfileUpdateRequest;
import com.vijaybrothers.store.dto.auth.ProfileUpdateResponse;
import com.vijaybrothers.store.model.Admin;
import com.vijaybrothers.store.repository.AdminRepository;
import com.vijaybrothers.store.security.JwtService;
import com.vijaybrothers.store.service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Override
    public SignupResponse signup(SignupRequest request) {
        // Check if username exists
        if (adminRepository.existsByUserName(request.getUsername())) {
            return new SignupResponse(null, "Username already taken");
        }
        // Check if email exists
        if (adminRepository.findByEmail(request.getEmail()).isPresent()) {
            return new SignupResponse(null, "Email already registered");
        }

        // Create new admin
        Admin admin = new Admin();
        admin.setUserName(request.getUsername());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setEmail(request.getEmail());
        admin.setCreatedAt(Instant.now());
        admin.setUpdatedAt(Instant.now());

        adminRepository.save(admin);

        // Generate JWT token
        String token = jwtService.generateToken(admin);
        return new SignupResponse(token, "Account created successfully");
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        Optional<Admin> adminOptional = adminRepository.findByUserName(request.getUsername());
        if (adminOptional.isPresent() && passwordEncoder.matches(request.getPassword(), adminOptional.get().getPassword())) {
            Admin admin = adminOptional.get();
            // Generate JWT token
            String token = jwtService.generateToken(admin);
            return new LoginResponse(token, "Login successful");
        }
        return new LoginResponse(null, "Invalid credentials");
    }

    @Override
    public ProfileUpdateResponse updateProfile(String currentUserName, ProfileUpdateRequest request) {
        Optional<Admin> adminOptional = adminRepository.findByUserName(currentUserName);

        if (adminOptional.isEmpty()) {
            return new ProfileUpdateResponse(null, "Admin not found", null);
        }

        Admin admin = adminOptional.get();

        // Update user_name if provided
        if (request.getUser_name() != null && !request.getUser_name().isEmpty()) {
            // Check if new username is already taken by another admin
            if (!request.getUser_name().equals(admin.getUserName()) && adminRepository.existsByUserName(request.getUser_name())) {
                return new ProfileUpdateResponse(null, "Username already taken", null);
            }
            admin.setUserName(request.getUser_name());
        }

        // Update user_email if provided
        if (request.getUser_email() != null && !request.getUser_email().isEmpty()) {
            // Check if new email is already registered by another admin
            if (!request.getUser_email().equals(admin.getEmail()) && adminRepository.existsByEmail(request.getUser_email())) {
                return new ProfileUpdateResponse(null, "Email already registered", null);
            }
            admin.setEmail(request.getUser_email());
        }

        // Update profile_image_url if provided
        if (request.getUser_image() != null) {
            admin.setProfileImageUrl(request.getUser_image());
        }

        // Handle password change
        if (Boolean.TRUE.equals(request.getIs_password_changed())) {
            if (request.getOld_password() == null || request.getNew_password() == null || request.getNew_password().isEmpty()) {
                return new ProfileUpdateResponse(null, "Old and new passwords are required for password change", null);
            }
            if (!passwordEncoder.matches(request.getOld_password(), admin.getPassword())) {
                return new ProfileUpdateResponse(null, "Invalid old password", null);
            }
            admin.setPassword(passwordEncoder.encode(request.getNew_password()));
        }

        admin.setUpdatedAt(Instant.now());
        adminRepository.save(admin);

        // Generate new JWT token (if username changed, token needs to reflect new username)
        String newToken = jwtService.generateToken(admin);

        return new ProfileUpdateResponse(newToken, "Profile updated successfully", admin.getProfileImageUrl());
    }
}
