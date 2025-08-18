package com.vijaybrothers.store.service.impl;

import com.vijaybrothers.store.dto.AdminProfileUpdateDTO;
import com.vijaybrothers.store.dto.auth.LoginRequest;
import com.vijaybrothers.store.dto.auth.LoginResponse;
import com.vijaybrothers.store.dto.auth.SignupRequest;
import com.vijaybrothers.store.dto.auth.SignupResponse;
import com.vijaybrothers.store.dto.auth.ProfileUpdateResponse;
import com.vijaybrothers.store.model.Admin;
import com.vijaybrothers.store.repository.AdminRepository;
import com.vijaybrothers.store.repository.PasswordResetTokenRepository;
import com.vijaybrothers.store.security.JwtService;
import com.vijaybrothers.store.service.AdminService;
import com.vijaybrothers.store.service.EmailService;
import com.vijaybrothers.store.service.StorageService;
import com.vijaybrothers.store.model.PasswordResetToken;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;


@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private StorageService storageService;

    @Autowired
    private EmailService emailService;

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
                String imageUrl = storageService.store(request.getProfileImage(), "profile_images", admin.getUserName());
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

    @Override
    @Transactional
    public ProfileUpdateResponse updateProfile(Admin currentAdmin, AdminProfileUpdateDTO request) {
        try {
            // Update username if provided
            if (request.getUserName() != null && !request.getUserName().isEmpty()) {
                // Check if new username is already taken by another admin
                if (!request.getUserName().equals(currentAdmin.getUserName()) && 
                    adminRepository.existsByUserName(request.getUserName())) {
                    return ProfileUpdateResponse.builder().message("Username already taken").build();
                }
                currentAdmin.setUserName(request.getUserName());
            }

            // Update email if provided
            if (request.getEmail() != null && !request.getEmail().isEmpty()) {
                // Check if new email is already registered by another admin
                if (!request.getEmail().equals(currentAdmin.getEmail()) && 
                    adminRepository.existsByEmail(request.getEmail())) {
                    return ProfileUpdateResponse.builder().message("Email already registered").build();
                }
                currentAdmin.setEmail(request.getEmail());
            }

            // Handle profile image
            if (request.isRemoveProfileImage()) {
                // Remove existing profile image
                if (currentAdmin.getProfileImageUrl() != null) {
                    try {
                        storageService.deleteFile(currentAdmin.getProfileImageUrl());
                    } catch (Exception e) {
                        // Log but don't fail the update if image deletion fails
                        System.err.println("Failed to delete old profile image: " + e.getMessage());
                    }
                }
                currentAdmin.setProfileImageUrl(null);
            } else if (request.getProfileImage() != null && !request.getProfileImage().isEmpty()) {
                // Delete old image if exists
                if (currentAdmin.getProfileImageUrl() != null) {
                    try {
                        storageService.deleteFile(currentAdmin.getProfileImageUrl());
                    } catch (Exception e) {
                        System.err.println("Failed to delete old profile image: " + e.getMessage());
                    }
                }
                // Store new image
                String imageUrl = storageService.store(request.getProfileImage(), "profile_images", currentAdmin.getUserName());
                currentAdmin.setProfileImageUrl(imageUrl);
            }

            // Handle password change
            if (request.getOldPassword() != null && !request.getOldPassword().isEmpty() &&
                request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
                if (!passwordEncoder.matches(request.getOldPassword(), currentAdmin.getPassword())) {
                    return ProfileUpdateResponse.builder().message("Invalid old password").build();
                }
                currentAdmin.setPassword(passwordEncoder.encode(request.getNewPassword()));
            }

            currentAdmin.setUpdatedAt(Instant.now());
            adminRepository.save(currentAdmin);

            // Generate new JWT token to reflect any changes
            String newToken = jwtService.generateToken(currentAdmin);

            return ProfileUpdateResponse.builder()
                .token(newToken)
                .message("Profile updated successfully")
                .profileImageUrl(currentAdmin.getProfileImageUrl())
                .build();

        } catch (Exception e) {
            System.err.println("Error updating admin profile: " + e.getMessage());
            e.printStackTrace();
            return ProfileUpdateResponse.builder().message("An unexpected error occurred during profile update.").build();
        }
    }

    @Override
    @Transactional
    public void forgotPassword(String email, String resetLinkBase) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Admin with this email not found."));

        // Check if a token already exists for this admin
        Optional<PasswordResetToken> existingToken = passwordResetTokenRepository.findByAdmin(admin);
        
        String token = UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plus(1, ChronoUnit.HOURS); // Token valid for 1 hour

        PasswordResetToken resetToken;
        if (existingToken.isPresent()) {
            // Update existing token
            resetToken = existingToken.get();
            resetToken.setToken(token);
            resetToken.setExpiryDate(expiryDate);
        } else {
            // Create new token
            resetToken = new PasswordResetToken(token, admin, expiryDate);
        }
        passwordResetTokenRepository.save(resetToken);

        String resetLink = resetLinkBase + "?token=" + token;
        String subject = "Password Reset Request";
        String text = "To reset your password, click the following link: " + resetLink +
                      "\n\nThis link will expire in 1 hour.";

        emailService.sendEmail(admin.getEmail(), subject, text);
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired password reset token."));

        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken); // Clean up expired token
            throw new IllegalArgumentException("Password reset token has expired.");
        }

        Admin admin = resetToken.getAdmin();
        admin.setPassword(passwordEncoder.encode(newPassword));
        admin.setUpdatedAt(Instant.now());
        adminRepository.save(admin);

        passwordResetTokenRepository.delete(resetToken); // Invalidate token after use
    }
}