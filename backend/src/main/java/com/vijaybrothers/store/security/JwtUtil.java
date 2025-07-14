package com.vijaybrothers.store.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;
import io.jsonwebtoken.io.Decoders; // Import Decoders for Base64 decoding

@Component
public class JwtUtil {
    @Value("${application.security.jwt.secret-key}")
    private String jwtSecret;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret.trim());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String subject) {
        System.out.println("Generating token with secret: " + jwtSecret); // Debugging line
        Date now = new Date();
        return Jwts.builder()
            .setSubject(subject)
            .setIssuedAt(now)
            .setExpiration(new Date(now.getTime() + jwtExpirationMs))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            System.out.println("Validating token with secret: " + jwtSecret); // Debugging line
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            System.out.println("JWT Validation failed: " + e.getMessage()); // Debugging line
            return false;
        }
    }

    // Temporary main method to generate a new key
    public static void main(String[] args) {
        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        io.jsonwebtoken.io.Encoders.BASE64.encode(key.getEncoded());
    }
}
