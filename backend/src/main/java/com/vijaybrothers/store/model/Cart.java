package com.vijaybrothers.store.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Integer cartId;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "cart", fetch = FetchType.LAZY)
    private List<CartItem> items;

    // Getters
    public Integer getCartId() { return cartId; }
    public Instant getCreatedAt() { return createdAt; }
    public List<CartItem> getItems() { return items; }

    // Setters
    public void setCartId(Integer cartId) { this.cartId = cartId; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public void setItems(List<CartItem> items) { this.items = items; }
}
