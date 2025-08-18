package com.vijaybrothers.store.repository;

import com.vijaybrothers.store.model.Admin;
import com.vijaybrothers.store.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByAdmin(Admin admin);
    void deleteByAdmin(Admin admin);
}
