package com.vijaybrothers.store.repository;

import com.vijaybrothers.store.model.GuestCheckoutDetails;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for guest checkout details.
 */
public interface GuestCheckoutDetailsRepository extends JpaRepository<GuestCheckoutDetails, Integer> {
}