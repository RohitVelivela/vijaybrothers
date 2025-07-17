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

    public static CartItemDto from(CartItem ci) {
        return CartItemDto.builder()
            .cartItemId(ci.getCartItemId())
            .productId(ci.getProduct().getProductId())
            .productName(ci.getProduct().getName())
            .quantity(ci.getQuantity())
            .addedAt(ci.getAddedAt())
            .build();
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