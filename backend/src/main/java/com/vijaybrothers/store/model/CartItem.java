package com.vijaybrothers.store.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "cart_items")
@NoArgsConstructor @AllArgsConstructor @Builder
public class CartItem {

    public Integer getCartItemId() { return cartItemId; }
    public Cart getCart() { return cart; }
    public Product getProduct() { return product; }
    public Integer getQuantity() { return quantity; }
    public Integer getGuestId() { return guestId; }
    public Instant getAddedAt() { return addedAt; }

    public void setCart(Cart cart) { this.cart = cart; }
    public void setProduct(Product product) { this.product = product; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setGuestId(Integer guestId) { this.guestId = guestId; }
    public void setAddedAt(Instant addedAt) { this.addedAt = addedAt; }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_id")
    private Integer cartItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;

    @Column(name = "guest_id")
    private Integer guestId;

    @Column(name = "added_at")
    private Instant addedAt;
}
