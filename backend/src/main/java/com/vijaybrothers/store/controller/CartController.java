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

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import com.vijaybrothers.store.repository.ProductRepository;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    private final ProductRepository productRepository;
    
    // Test endpoint to debug cart creation
    @PostMapping("/test-create")
    public ResponseEntity<?> testCreateCart() {
        try {
            System.out.println("[DEBUG] Testing cart creation...");
            CartView cart = cartService.buildView(null); // This should create empty cart
            System.out.println("[DEBUG] Test cart created successfully: " + cart.cartId());
            return ResponseEntity.ok(Map.of("success", true, "cartId", cart.cartId(), "message", "Cart created successfully"));
        } catch (Exception e) {
            System.err.println("[ERROR] Test cart creation failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "error", e.getMessage()));
        }
    }
    
    // Test endpoint to validate product exists
    @GetMapping("/test-product/{productId}")
    public ResponseEntity<?> testProduct(@PathVariable Integer productId) {
        try {
            System.out.println("[DEBUG] Testing product lookup for ID: " + productId);
            var product = productRepository.findById(productId);
            if (product.isPresent()) {
                System.out.println("[DEBUG] Product found: " + product.get().getName());
                return ResponseEntity.ok(Map.of("success", true, "productId", productId, "name", product.get().getName()));
            } else {
                System.out.println("[DEBUG] Product not found: " + productId);
                return ResponseEntity.ok(Map.of("success", false, "message", "Product not found"));
            }
        } catch (Exception e) {
            System.err.println("[ERROR] Test product lookup failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/items")
    public ResponseEntity<?> addToCart(
        @CookieValue(name = "cartId", required = false) String cartIdCookie,
        @Valid @RequestBody CartItemRequest request,
        HttpServletResponse response
    ) {
        System.out.println("[DEBUG] AddToCart - cartIdCookie: " + cartIdCookie);
        System.out.println("[DEBUG] AddToCart - request: " + request);
        
        Integer cartId = null;
        
        // Try to get existing cart ID from cookie
        if (cartIdCookie != null && !cartIdCookie.isBlank()) {
            try {
                cartId = Integer.parseInt(cartIdCookie);
                System.out.println("[DEBUG] AddToCart - parsed cartId: " + cartId);
            } catch (NumberFormatException e) {
                System.out.println("[DEBUG] AddToCart - invalid cartId in cookie: " + cartIdCookie);
                cartId = null;
            }
        }
        
        // Validate request
        if (request.productId() == null) {
            System.err.println("[ERROR] AddToCart - Product ID is null");
            return ResponseEntity.badRequest().build();
        }
        
        if (request.quantity() <= 0) {
            System.err.println("[ERROR] AddToCart - Invalid quantity: " + request.quantity());
            return ResponseEntity.badRequest().build();
        }
        
        // Add item to cart (service will create new cart if cartId is null)
        try {
            CartView cartView = cartService.addItem(cartId, request);
            System.out.println("[DEBUG] AddToCart - cartView created: " + cartView.cartId() + " with " + cartView.lines().size() + " items");
            
            // Set cart ID cookie if it was newly created
            if (cartIdCookie == null || cartIdCookie.isBlank() || !cartView.cartId().equals(cartIdCookie)) {
                Cookie c = new Cookie("cartId", cartView.cartId());
                c.setPath("/");
                c.setHttpOnly(true);
                c.setMaxAge(7 * 24 * 60 * 60);
                response.addCookie(c);
                System.out.println("[DEBUG] AddToCart - setting cartId cookie: " + cartView.cartId());
            }
            
            return ResponseEntity.ok(cartView);
        } catch (IllegalArgumentException e) {
            System.err.println("[ERROR] AddToCart - IllegalArgumentException: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid request", "details", e.getMessage()));
        } catch (Exception e) {
            System.err.println("[ERROR] AddToCart - Exception: " + e.getClass().getSimpleName() + ": " + e.getMessage());
            e.printStackTrace();
            
            // Check if it's a specific database constraint error
            String errorMessage = e.getMessage().toLowerCase();
            if (errorMessage.contains("constraint") || errorMessage.contains("duplicate") || errorMessage.contains("unique")) {
                System.err.println("[ERROR] AddToCart - Database constraint violation detected");
                return ResponseEntity.status(409).body(Map.of("error", "Duplicate item in cart", "details", e.getMessage()));
            }
            
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error", "details", e.getMessage(), "type", e.getClass().getSimpleName()));
        }
    }

    @GetMapping
    public CartView viewCart(
        @CookieValue(name = "cartId", required = false) String cartIdCookie,
        HttpServletResponse response
    ) {
        Integer cartId = null;
        
        // Try to get existing cart ID from cookie
        if (cartIdCookie != null && !cartIdCookie.isBlank()) {
            try {
                cartId = Integer.parseInt(cartIdCookie);
            } catch (NumberFormatException e) {
                // Invalid cart ID in cookie, will return empty cart
                cartId = null;
            }
        }
        
        // Get cart view (service will return empty cart if cartId is null)
        CartView cartView = cartService.buildView(cartId);
        
        // Set cart ID cookie if cart exists and cookie wasn't set
        if (cartId != null && (cartIdCookie == null || cartIdCookie.isBlank())) {
            Cookie c = new Cookie("cartId", cartId.toString());
            c.setPath("/");
            c.setHttpOnly(true);
            c.setMaxAge(7 * 24 * 60 * 60);
            response.addCookie(c);
        }
        
        return cartView;
    }

    @PutMapping("/items/by-product/{productId}")
    public CartView updateByProductId(
        @CookieValue(name = "cartId", required = false) String cartIdCookie,
        @PathVariable Integer productId,
        @Valid @RequestBody CartUpdateRequest req,
        HttpServletResponse response
    ) {
        Integer cartId = null;
        
        if (cartIdCookie != null && !cartIdCookie.isBlank()) {
            try {
                cartId = Integer.parseInt(cartIdCookie);
            } catch (NumberFormatException e) {
                cartId = null;
            }
        }
        
        if (cartId == null) {
            // No valid cart found, return empty cart
            return new CartView("", List.of(), BigDecimal.ZERO, BigDecimal.ZERO);
        }

        return cartService.updateByProductId(cartId, productId, req.quantity());
    }

    @DeleteMapping("/items/by-product/{productId}")
    public CartView deleteByProductId(
        @CookieValue(name = "cartId", required = false) String cartIdCookie,
        @PathVariable Integer productId,
        HttpServletResponse response
    ) {
        Integer cartId = null;
        
        if (cartIdCookie != null && !cartIdCookie.isBlank()) {
            try {
                cartId = Integer.parseInt(cartIdCookie);
            } catch (NumberFormatException e) {
                cartId = null;
            }
        }
        
        if (cartId == null) {
            // No valid cart found, return empty cart
            return new CartView("", List.of(), BigDecimal.ZERO, BigDecimal.ZERO);
        }

        return cartService.deleteByProductId(cartId, productId);
    }

    @GetMapping("/items/by-product/{productId}")
    public ResponseEntity<CartItemDto> getCartItemByProductId(
        @CookieValue(name = "cartId", required = false) String cartIdCookie,
        @PathVariable Integer productId
    ) {
        if (cartIdCookie == null || cartIdCookie.isBlank()) {
            return ResponseEntity.ok(null);
        }
        
        try {
            Integer cartId = Integer.parseInt(cartIdCookie);
            return cartService.getItemByProductId(cartId, productId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(null));
        } catch (NumberFormatException e) {
            return ResponseEntity.ok(null);
        }
    }

    @GetMapping("/count")
    public Map<String, Integer> getCartItemCount(
        @CookieValue(name = "cartId", required = false) String cartIdCookie
    ) {
        if (cartIdCookie == null || cartIdCookie.isBlank()) {
            return Map.of("count", 0);
        }
        
        try {
            Integer cartId = Integer.parseInt(cartIdCookie);
            int count = cartService.getItemCount(cartId);
            return Map.of("count", count);
        } catch (NumberFormatException e) {
            return Map.of("count", 0);
        }
    }

    @PutMapping("/items/{itemId}")
    public CartView updateItem(
        @PathVariable Integer itemId,
        @Valid @RequestBody CartUpdateRequest req,
        @CookieValue(name = "cartId", required = false) String cartIdCookie,
        HttpServletResponse response
    ) {
        // This method updates by cart item ID, so cart ID validation is less critical
        return cartService.updateQty(itemId, req.quantity());
    }

    @DeleteMapping("/items/{itemId}")
    public CartView deleteItem(
        @PathVariable Integer itemId,
        @CookieValue(name = "cartId", required = false) String cartIdCookie,
        HttpServletResponse response
    ) {
        // This method updates by cart item ID, so cart ID validation is less critical
        return cartService.updateQty(itemId, 0);
    }

}
