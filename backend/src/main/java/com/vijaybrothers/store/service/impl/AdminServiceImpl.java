package com.vijaybrothers.store.service.impl;

import com.vijaybrothers.store.dto.AdminProfileUpdateDTO;
import com.vijaybrothers.store.dto.auth.LoginRequest;
import com.vijaybrothers.store.dto.auth.LoginResponse;
import com.vijaybrothers.store.dto.auth.SignupRequest;
import com.vijaybrothers.store.dto.auth.SignupResponse;
import com.vijaybrothers.store.dto.auth.ProfileUpdateResponse;
import com.vijaybrothers.store.model.Admin;
import com.vijaybrothers.store.repository.AdminRepository;
import com.vijaybrothers.store.security.JwtService;
import com.vijaybrothers.store.service.AdminService;
import com.vijaybrothers.store.service.StorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @Autowired
    private StorageService storageService;

    @Override
    public SignupResponse signup(SignupRequest request) {
        // Check if username exists
        if (adminRepository.existsByUserName(request.getUsername())) {
            return SignupResponse.builder().message("Username already taken").build();
        }
        // Check if email exists
        if (adminRepository.findByEmail(request.getEmail()).isPresent()) {
            return SignupResponse.builder().message("Email already registered").build();
        }

        // Create new admin
        Admin admin = new Admin();
        admin.setUserName(request.getUsername());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setEmail(request.getEmail());
        admin.setRole("ADMIN"); // Set default role
        admin.setCreatedAt(Instant.now());
        admin.setUpdatedAt(Instant.now());

        adminRepository.save(admin);

        // Generate JWT token
        String token = jwtService.generateToken(admin);
        return SignupResponse.builder().token(token).message("Account created successfully").build();
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        Optional<Admin> adminOptional = adminRepository.findByUserName(request.getUsername());
        if (adminOptional.isPresent() && passwordEncoder.matches(request.getPassword(), adminOptional.get().getPassword())) {
            Admin admin = adminOptional.get();
            // Generate JWT token
            String token = jwtService.generateToken(admin);
            return LoginResponse.builder().token(token).message("Login successful").build();
        }
        return LoginResponse.builder().message("Invalid credentials").build();
    }

    @Override
    public ProfileUpdateResponse updateUser(Long userId, AdminProfileUpdateDTO request) {
        try {
            Optional<Admin> adminOptional = adminRepository.findById(userId);

            if (adminOptional.isEmpty()) {
                return ProfileUpdateResponse.builder().message("User not found").build();
            }

            Admin admin = adminOptional.get();

            // Update user_name if provided
            if (request.getUserName() != null && !request.getUserName().isEmpty()) {
                // Check if new username is already taken by another admin
                if (!request.getUserName().equals(admin.getUserName()) && adminRepository.existsByUserName(request.getUserName())) {
                    return ProfileUpdateResponse.builder().message("Username already taken").build();
                }
                admin.setUserName(request.getUserName());
            }

            // Update user_email if provided
            if (request.getEmail() != null && !request.getEmail().isEmpty()) {
                // Check if new email is already registered by another admin
                if (!request.getEmail().equals(admin.getEmail()) && adminRepository.existsByEmail(request.getEmail())) {
                    return ProfileUpdateResponse.builder().message("Email already registered").build();
                }
                admin.setEmail(request.getEmail());
            }

            // Handle profile image
            if (request.isRemoveProfileImage()) {
                admin.setProfileImageUrl(null);
            } else if (request.getProfileImage() != null && !request.getProfileImage().isEmpty()) {
                String imageUrl = storageService.store(request.getProfileImage());
                admin.setProfileImageUrl(imageUrl);
            }

            // Handle password change
            if (request.getOldPassword() != null && !request.getOldPassword().isEmpty() &&
                request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
                if (!passwordEncoder.matches(request.getOldPassword(), admin.getPassword())) {
                    return ProfileUpdateResponse.builder().message("Invalid old password").build();
                }
                admin.setPassword(passwordEncoder.encode(request.getNewPassword()));
            }

            admin.setUpdatedAt(Instant.now());
            adminRepository.save(admin);

            // Generate new JWT token (if username changed, token needs to reflect new username)
            String newToken = jwtService.generateToken(admin);

            return ProfileUpdateResponse.builder().token(newToken).message("Profile updated successfully").user_image(admin.getProfileImageUrl()).build();
        } catch (Exception e) {
            // Log the exception for debugging purposes
            System.err.println("Error updating admin profile: " + e.getMessage());
            e.printStackTrace();
            return ProfileUpdateResponse.builder().message("An unexpected error occurred during profile update.").build();
        }
    }
}