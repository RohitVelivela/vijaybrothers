package com.vijaybrothers.store.config;

import com.vijaybrothers.store.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.http.HttpMethod;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity

@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000") // You should restrict this in production
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(false).maxAge(3600);
            }
        };
    }

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));  // You should restrict this in production
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
        configuration.setExposedHeaders(Arrays.asList("x-auth-token"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/admin/signup", "/api/admin/login").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**", "/api/categories/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/categories/**").permitAll()
                .requestMatchers("/api/cart/**").permitAll()
                .requestMatchers("/api/checkout/guest/**").permitAll()
                .requestMatchers("/api/payments/webhook").permitAll()

                .requestMatchers(HttpMethod.POST, "/api/admin/categories").hasRole("ADMIN")

                // Admin product management - now public (no auth required)
                .requestMatchers(HttpMethod.POST, "/api/admin/products").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/admin/products").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/admin/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/admin/products/**").hasRole("ADMIN")

                // Admin category management - now public (no auth required)
                
                .requestMatchers(HttpMethod.GET, "/api/admin/categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/admin/categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/admin/categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/admin/categories/*/products").authenticated()

                // Admin order management (still protected)
                //.requestMatchers(HttpMethod.GET, "/api/admin/orders/**").hasRole("ADMIN")

                // Permit authenticated access to /api/orders endpoints
                //.requestMatchers("/api/orders/**").authenticated()

                // Admin profile management (still protected)
                //.requestMatchers(HttpMethod.PUT, "/api/admin/profile").hasRole("ADMIN")

                // All other endpoints
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}