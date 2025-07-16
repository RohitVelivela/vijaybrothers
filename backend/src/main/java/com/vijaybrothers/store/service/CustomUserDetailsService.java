package com.vijaybrothers.store.service;

import com.vijaybrothers.store.model.Admin;
import com.vijaybrothers.store.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return adminRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found with username: " + username));
    }
}
