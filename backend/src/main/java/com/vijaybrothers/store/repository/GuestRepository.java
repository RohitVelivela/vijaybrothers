package com.vijaybrothers.store.repository;

import com.vijaybrothers.store.model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest, Integer> {
}