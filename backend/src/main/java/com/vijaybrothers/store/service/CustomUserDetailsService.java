package com.vijaybrothers.store.service;

import com.vijaybrothers.store.model.Admin;
import com.vijaybrothers.store.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired private AdminRepository adminRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Admin admin = adminRepo.findByUserName(username)
            .orElseThrow(() -> new UsernameNotFoundException("Admin not found with username: " + username));

        return new org.springframework.security.core.userdetails.User(
            admin.getUserName(),
            admin.getPassword(),
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
    }
}
