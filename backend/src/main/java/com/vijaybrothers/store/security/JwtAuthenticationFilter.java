package com.vijaybrothers.store.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        System.out.println("Auth Header: " + authHeader); // DEBUG
        final String jwt;
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            System.out.println("No Bearer token found or invalid header format."); // DEBUG
            filterChain.doFilter(request, response);
            return;
        }
        jwt = authHeader.substring(7);
        System.out.println("Extracted JWT: " + jwt); // DEBUG
        final String userName = jwtService.extractUsername(jwt);
        System.out.println("Extracted Username from JWT: " + userName); // DEBUG
        if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userName);
            System.out.println("Loaded UserDetails: " + (userDetails != null ? userDetails.getUsername() : "null")); // DEBUG
            if (userDetails != null && jwtService.isTokenValid(jwt, userDetails)) {
                System.out.println("JWT is valid. Setting SecurityContextHolder."); // DEBUG
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                System.out.println("JWT is invalid or userDetails is null."); // DEBUG
            }
        } else {
            System.out.println("Username is null or SecurityContextHolder already has authentication."); // DEBUG
        }
        filterChain.doFilter(request, response);
    }
}
