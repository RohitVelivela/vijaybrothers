package com.vijaybrothers.store.repository;

import com.vijaybrothers.store.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Integer> {
}
