package com.vijaybrothers.store.dto;

import com.vijaybrothers.store.model.CartItem;
import lombok.*;

import java.time.Instant;

@Builder
public class CartItemDto {
    private Integer cartItemId;
    private Integer productId;
    private String productName;
    private Integer quantity;
    private Instant addedAt;

    public CartItemDto(Integer cartItemId, Integer productId, String productName, Integer quantity, Instant addedAt) {
        this.cartItemId = cartItemId;
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.addedAt = addedAt;
    }

    public static CartItemDto from(CartItem ci) {
        return new CartItemDto(ci.getCartItemId(), ci.getProduct().getProductId(), ci.getProduct().getName(), ci.getQuantity(), ci.getAddedAt());
    }

    // Getters
    public Integer getCartItemId() { return cartItemId; }
    public Integer getProductId() { return productId; }
    public String getProductName() { return productName; }
    public Integer getQuantity() { return quantity; }
    public Instant getAddedAt() { return addedAt; }

    // Setters
    public void setCartItemId(Integer cartItemId) { this.cartItemId = cartItemId; }
    public void setProductId(Integer productId) { this.productId = productId; }
    public void setProductName(String productName) { this.productName = productName; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setAddedAt(Instant addedAt) { this.addedAt = addedAt; }
}