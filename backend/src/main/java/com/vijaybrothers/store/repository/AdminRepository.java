package com.vijaybrothers.store.repository;

import com.vijaybrothers.store.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    @Query("SELECT a FROM Admin a WHERE a.userName = :userName")
    Optional<Admin> findByUserName(@Param("userName") String userName);

    @Query("SELECT a FROM Admin a WHERE a.email = :email")
    Optional<Admin> findByEmail(@Param("email") String email);

    @Query("SELECT a FROM Admin a WHERE a.adminId = :adminId")
    Optional<Admin> findByAdminId(@Param("adminId") Long adminId);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Admin a WHERE a.userName = :userName")
    boolean existsByUserName(@Param("userName") String userName);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Admin a WHERE a.email = :email")
    boolean existsByEmail(@Param("email") String email);
}
