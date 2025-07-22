package com.vijaybrothers.store.controller;


import com.vijaybrothers.store.dto.AdminProfileUpdateDTO;
import com.vijaybrothers.store.dto.auth.LoginRequest;
import com.vijaybrothers.store.dto.auth.LoginResponse;
import com.vijaybrothers.store.dto.auth.ProfileUpdateResponse;
import com.vijaybrothers.store.dto.auth.SignupRequest;
import com.vijaybrothers.store.dto.auth.SignupResponse;
import com.vijaybrothers.store.dto.auth.ForgotPasswordRequest;
import com.vijaybrothers.store.dto.auth.ResetPasswordRequest;
import com.vijaybrothers.store.model.Admin;
import com.vijaybrothers.store.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.ModelAttribute;

@RestController
@RequestMapping("/api/admin")
@Validated
@Tag(name = "Admin", description = "Admin authentication and profile management endpoints")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Value("${app.frontend.url}")
    private String frontendUrl;


    @Operation(
        summary = "Login to admin account",
        responses = {
            @ApiResponse(responseCode = "200", description = "Successful login"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
        }
    )
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        LoginResponse resp = adminService.login(request);
        return ResponseEntity.ok(resp);
    }

    @Operation(
        summary = "Register a new admin account",
        responses = {
            @ApiResponse(responseCode = "200", description = "Account created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or username/email already taken")
        }
    )
    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@Valid @RequestBody SignupRequest request) {
        SignupResponse response = adminService.signup(request);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Logout from admin account",
        security = { @SecurityRequirement(name = "bearer-jwt") },
        responses = {
            @ApiResponse(responseCode = "200", description = "Successful logout"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
        }
    )
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // In a real application, you would invalidate the token here (e.g., add to a blacklist)
        return ResponseEntity.ok("Logged out successfully");
    }

    @Operation(
        summary = "Get admin profile",
        security = { @SecurityRequirement(name = "bearer-jwt") },
        responses = {
            @ApiResponse(responseCode = "200", description = "Profile fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "404", description = "Admin not found")
        }
    )
    @GetMapping("/profile")
    public ResponseEntity<Admin> getAdminProfile(@AuthenticationPrincipal Admin currentAdmin) {
        return ResponseEntity.ok(currentAdmin);
    }

    
    @Operation(
        summary = "Update admin user details by ID",
        security = { @SecurityRequirement(name = "bearer-jwt") },
        responses = {
            @ApiResponse(responseCode = "200", description = "User updated successfully"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
        }
    )
    @PutMapping(value = "/users/{userId}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ProfileUpdateResponse> updateAdminUser(
            @PathVariable Long userId,
            @ModelAttribute AdminProfileUpdateDTO request
    ) {
        ProfileUpdateResponse resp = adminService.updateUser(userId, request);
        return ResponseEntity.ok(resp);
    }

    @Operation(
        summary = "Request password reset",
        responses = {
            @ApiResponse(responseCode = "200", description = "Password reset email sent"),
            @ApiResponse(responseCode = "400", description = "Invalid email or other error")
        }
    )
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            String resetLinkBase = frontendUrl + "/auth/reset-password"; // Frontend reset password page
            adminService.forgotPassword(request.getEmail(), resetLinkBase);
            return ResponseEntity.ok("Password reset link sent to your email.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(
        summary = "Reset password",
        responses = {
            @ApiResponse(responseCode = "200", description = "Password reset successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid token or other error")
        }
    )
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            adminService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok("Password has been reset successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}