package com.vijaybrothers.store.repository;

import com.vijaybrothers.store.model.UserDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserDetailRepository extends JpaRepository<UserDetail, Integer> {
    Optional<UserDetail> findByUserName(String userName);
    Optional<UserDetail> findByUserEmail(String userEmail);
    boolean existsByUserName(String userName);
}
