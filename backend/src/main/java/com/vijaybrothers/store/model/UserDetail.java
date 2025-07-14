package com.vijaybrothers.store.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.Collection;
import java.util.Collections;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority; // New import
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "user_details")
@Data
public class UserDetail implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "user_image")
    private byte[] userImage;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(name = "updated_by")
    private Integer updatedBy;

    @Column(name = "role") // Assuming a 'role' column in the database
    private String role;

    public String getUserName() {
        return this.userName;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return userName; // Using userName as the username for Spring Security
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Assuming accounts do not expire
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Assuming accounts are not locked
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Assuming credentials do not expire
    }

    @Override
    public boolean isEnabled() {
        return true; // Assuming accounts are always enabled
    }
}
