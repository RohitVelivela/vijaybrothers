package com.vijaybrothers.store.repository;

import com.vijaybrothers.store.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrder_OrderId(Long orderId);
    Optional<Payment> findByOrder_OrderNumber(String orderNumber);
}
