package com.vijaybrothers.store.repository;

import com.vijaybrothers.store.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCart_CartId(Integer cartId);
    Optional<CartItem> findByCart_CartIdAndProduct_ProductId(Integer cartId, Integer productId);
    int countByCart_CartId(Integer cartId);
    
    @Modifying
    @Transactional
    @Query("UPDATE CartItem c SET c.guestId = :guestId WHERE c.cart.cartId = :cartId")
    void assignGuestToCartItems(Integer cartId, Integer guestId);
    
    @Query("SELECT DISTINCT c.guestId FROM CartItem c WHERE c.cart.cartId = :cartId AND c.guestId IS NOT NULL")
    Optional<Integer> findGuestIdByCartId(Integer cartId);
    
    @Modifying
    @Transactional  
    @Query("UPDATE CartItem c SET c.guestId = NULL WHERE c.cart.cartId = :cartId")
    void clearGuestAssignments(Integer cartId);
}
