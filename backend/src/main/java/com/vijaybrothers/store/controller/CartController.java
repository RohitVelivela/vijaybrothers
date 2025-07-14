package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.CartItemDto;
import com.vijaybrothers.store.dto.cart.CartItemRequest;
import com.vijaybrothers.store.dto.cart.CartUpdateRequest;
import com.vijaybrothers.store.dto.cart.CartView;
import com.vijaybrothers.store.service.CartService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @PostMapping("/items")
    public ResponseEntity<CartView> addToCart(
        @CookieValue(name = "cartId", required = false) String cartId,
        @Valid @RequestBody CartItemRequest request
    ) {
        CartView cartView = cartService.addItem(Integer.parseInt(cartId), request);
        return ResponseEntity.ok(cartView);
    }

    @GetMapping
    public CartView viewCart(
        @CookieValue(name = "cartId", required = false) String cartIdCookie,
        HttpServletResponse response
    ) {
        String cartId = (cartIdCookie == null || cartIdCookie.isBlank())
            ? UUID.randomUUID().toString()
            : cartIdCookie;

        if (!cartId.equals(cartIdCookie)) {
            Cookie c = new Cookie("cartId", cartId);
            c.setPath("/");
            c.setHttpOnly(true);
            c.setMaxAge(7 * 24 * 60 * 60);
            response.addCookie(c);
        }

        return cartService.buildView(Integer.parseInt(cartId));
    }

    @PutMapping("/items/by-product/{productId}")
    public CartView updateByProductId(
        @CookieValue(name = "cartId", required = false) String cartIdCookie,
        @PathVariable Integer productId,
        @Valid @RequestBody CartUpdateRequest req,
        HttpServletResponse response
    ) {
        String cartId = (cartIdCookie == null || cartIdCookie.isBlank())
            ? UUID.randomUUID().toString()
            : cartIdCookie;
        if (!cartId.equals(cartIdCookie)) {
            Cookie c = new Cookie("cartId", cartId);
            c.setPath("/");
            c.setHttpOnly(true);
            c.setMaxAge(7 * 24 * 60 * 60);
            response.addCookie(c);
        }

        return cartService.updateByProductId(Integer.parseInt(cartId), productId, req.quantity());
    }

    @DeleteMapping("/items/by-product/{productId}")
    public CartView deleteByProductId(
        @CookieValue(name = "cartId", required = false) String cartIdCookie,
        @PathVariable Integer productId,
        HttpServletResponse response
    ) {
        String cartId = (cartIdCookie == null || cartIdCookie.isBlank())
            ? UUID.randomUUID().toString()
            : cartIdCookie;
        if (!cartId.equals(cartIdCookie)) {
            Cookie c = new Cookie("cartId", cartId);
            c.setPath("/");
            c.setHttpOnly(true);
            c.setMaxAge(7 * 24 * 60 * 60);
            response.addCookie(c);
        }

        return cartService.deleteByProductId(Integer.parseInt(cartId), productId);
    }

    @GetMapping("/items/by-product/{productId}")
    public ResponseEntity<CartItemDto> getCartItemByProductId(
        @CookieValue(name = "cartId", required = false) String cartId,
        @PathVariable Integer productId
    ) {
        if (cartId == null || cartId.isBlank()) {
            return ResponseEntity.ok(null);
        }
        return cartService.getItemByProductId(Integer.parseInt(cartId), productId)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.ok(null));
    }

    @GetMapping("/count")
    public Map<String, Integer> getCartItemCount(
        @CookieValue(name = "cartId", required = false) String cartId
    ) {
        int count = (cartId == null || cartId.isBlank()) ? 0 : cartService.getItemCount(Integer.parseInt(cartId));
        return Map.of("count", count);
    }

    @PutMapping("/items/{itemId}")
    public CartView updateItem(
        @PathVariable Integer itemId,
        @Valid @RequestBody CartUpdateRequest req,
        @CookieValue(name = "cartId", required = false) String cartId,
        HttpServletResponse response
    ) {
        ensureCartCookie(cartId, response);
        return cartService.updateQty(itemId, req.quantity());
    }

    @DeleteMapping("/items/{itemId}")
    public CartView deleteItem(
        @PathVariable Integer itemId,
        @CookieValue(name = "cartId", required = false) String cartId,
        HttpServletResponse response
    ) {
        ensureCartCookie(cartId, response);
        return cartService.updateQty(itemId, 0);
    }

    private void ensureCartCookie(String cartIdCookie, HttpServletResponse response) {
        String cartId = (cartIdCookie == null || cartIdCookie.isBlank())
            ? UUID.randomUUID().toString()
            : cartIdCookie;
        if (!cartId.equals(cartIdCookie)) {
            Cookie c = new Cookie("cartId", cartId);
            c.setPath("/");
            c.setHttpOnly(true);
            c.setMaxAge(7 * 24 * 60 * 60);
            response.addCookie(c);
        }
    }
}
