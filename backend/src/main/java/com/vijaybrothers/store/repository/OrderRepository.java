package com.vijaybrothers.store.repository;

import com.vijaybrothers.store.model.Order;
import com.vijaybrothers.store.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, Long> {
    java.util.Optional<Order> findByOrderNumber(String orderNumber);

    Page<Order> findByOrderStatus(OrderStatus orderStatus, Pageable pageable);

    @Query("SELECT SUM(o.totalAmount) FROM Order o")
    java.math.BigDecimal sumTotalAmount();
    
    /**
     * Find all orders belonging to a guest using Spring Data JPA derived query.
     * This will automatically handle Pageable sorting and avoid JPQL issues.
     * Note: guestId is Integer in GuestCheckoutDetails, but we accept Long for API consistency
     */
    Page<Order> findByGuestCheckoutDetailsGuestId(Integer guestId, Pageable pageable);
}