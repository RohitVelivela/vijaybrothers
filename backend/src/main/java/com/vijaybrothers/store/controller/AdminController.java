package com.vijaybrothers.store.controller;


import com.vijaybrothers.store.dto.auth.LoginRequest;
import com.vijaybrothers.store.dto.auth.LoginResponse;
import com.vijaybrothers.store.dto.auth.ProfileUpdateRequest;
import com.vijaybrothers.store.dto.auth.ProfileUpdateResponse;
import com.vijaybrothers.store.dto.auth.SignupRequest;
import com.vijaybrothers.store.dto.auth.SignupResponse;
import com.vijaybrothers.store.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
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

@RestController
@RequestMapping("/api/admin")
@Validated
@Tag(name = "Admin", description = "Admin authentication and profile management endpoints")
public class AdminController {

    @Autowired
    private AdminService adminService;


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
        summary = "Update admin profile",
        security = { @SecurityRequirement(name = "bearer-jwt") },
        responses = {
            @ApiResponse(responseCode = "200", description = "Profile updated successfully"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
        }
    )
    @PutMapping("/account")
    public ResponseEntity<ProfileUpdateResponse> updateAccountProfile(
            @Valid @RequestBody ProfileUpdateRequest request,
            @AuthenticationPrincipal UserDetails currentAdmin
    ) {
        ProfileUpdateResponse resp = adminService.updateProfile(currentAdmin.getUsername(), request);
        return ResponseEntity.ok(resp);
    }
}