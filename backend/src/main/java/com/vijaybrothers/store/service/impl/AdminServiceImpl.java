package com.vijaybrothers.store.service.impl;

import com.vijaybrothers.store.dto.auth.LoginRequest;
import com.vijaybrothers.store.dto.auth.LoginResponse;
import com.vijaybrothers.store.dto.auth.SignupRequest;
import com.vijaybrothers.store.dto.auth.SignupResponse;
import com.vijaybrothers.store.dto.auth.ProfileUpdateRequest;
import com.vijaybrothers.store.dto.auth.ProfileUpdateResponse;
import com.vijaybrothers.store.model.UserDetail;
import com.vijaybrothers.store.repository.UserDetailRepository;
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
    private UserDetailRepository userDetailRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Override
    public SignupResponse signup(SignupRequest request) {
        // Check if username exists
        if (userDetailRepository.existsByUserName(request.getUsername())) {
            return new SignupResponse(null, "Username already taken");
        }
        // Check if email exists
        if (userDetailRepository.findByUserEmail(request.getEmail()).isPresent()) {
            return new SignupResponse(null, "Email already registered");
        }

        // Create new user
        UserDetail user = new UserDetail();
        user.setUserName(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setUserEmail(request.getEmail());
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        user.setRole("ADMIN");

        userDetailRepository.save(user);

        // Generate JWT token
        String token = jwtService.generateToken(user);
        return new SignupResponse(token, "Account created successfully");
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        Optional<UserDetail> userOptional = userDetailRepository.findByUserName(request.getUsername());
        if (userOptional.isPresent() && passwordEncoder.matches(request.getPassword(), userOptional.get().getPasswordHash())) {
            UserDetail user = userOptional.get();
            if (user.getRole() == null || !user.getRole().equals("ADMIN")) {
                user.setRole("ADMIN");
                userDetailRepository.save(user);
            }
            // Generate JWT token
            String token = jwtService.generateToken(user);
            return new LoginResponse(token, "Login successful");
        }
        return new LoginResponse(null, "Invalid credentials");
    }

    @Override
    public ProfileUpdateResponse updateProfile(String currentUserName, ProfileUpdateRequest request) {
        Optional<UserDetail> userOptional = userDetailRepository.findByUserName(currentUserName);

        if (userOptional.isEmpty()) {
            return new ProfileUpdateResponse(null, "User not found", null);
        }

        UserDetail userDetail = userOptional.get();

        // Update user_name if provided
        if (request.getUser_name() != null && !request.getUser_name().isEmpty()) {
            // Check if new username is already taken by another user
            if (!request.getUser_name().equals(userDetail.getUserName()) && userDetailRepository.existsByUserName(request.getUser_name())) {
                return new ProfileUpdateResponse(null, "Username already taken", null);
            }
            userDetail.setUserName(request.getUser_name());
        }

        // Update user_email if provided
        if (request.getUser_email() != null && !request.getUser_email().isEmpty()) {
            // Check if new email is already registered by another user
            if (!request.getUser_email().equals(userDetail.getUserEmail()) && userDetailRepository.findByUserEmail(request.getUser_email()).isPresent()) {
                return new ProfileUpdateResponse(null, "Email already registered", null);
            }
            userDetail.setUserEmail(request.getUser_email());
        }

        // Update user_image if provided
        if (request.getUser_image() != null) {
            try {
                userDetail.setUserImage(Base64.getDecoder().decode(request.getUser_image()));
            } catch (IllegalArgumentException e) {
                return new ProfileUpdateResponse(null, "Invalid user image format", null);
            }
        }

        // Handle password change
        if (Boolean.TRUE.equals(request.getIs_password_changed())) {
            if (request.getOld_password() == null || request.getNew_password() == null || request.getNew_password().isEmpty()) {
                return new ProfileUpdateResponse(null, "Old and new passwords are required for password change", null);
            }
            if (!passwordEncoder.matches(request.getOld_password(), userDetail.getPasswordHash())) {
                return new ProfileUpdateResponse(null, "Invalid old password", null);
            }
            userDetail.setPasswordHash(passwordEncoder.encode(request.getNew_password()));
        }

        userDetail.setUpdatedAt(Instant.now());
        userDetailRepository.save(userDetail);

        // Generate new JWT token (if username changed, token needs to reflect new username)
        String newToken = jwtService.generateToken(userDetail);
        String userImageBase64 = userDetail.getUserImage() != null ?
                                 Base64.getEncoder().encodeToString(userDetail.getUserImage()) : null;

        return new ProfileUpdateResponse(newToken, "Profile updated successfully", userImageBase64);
    }
}
