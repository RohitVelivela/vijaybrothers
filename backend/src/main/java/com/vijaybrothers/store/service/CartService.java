// src/main/java/com/vijaybrothers/store/service/CartService.java
package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.CartItemDto;
import com.vijaybrothers.store.dto.cart.CartItemRequest;
import com.vijaybrothers.store.dto.cart.CartView;
import com.vijaybrothers.store.model.Cart;
import com.vijaybrothers.store.model.CartItem;
import com.vijaybrothers.store.model.Product;
import com.vijaybrothers.store.repository.CartItemRepository;
import com.vijaybrothers.store.repository.CartRepository;
import com.vijaybrothers.store.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository     cartRepo;
    private final CartItemRepository itemRepo;
    private final ProductRepository  productRepo;

    /**
     * Lazily create a cart if none exists.
     */
    @Transactional
    public Cart getOrCreateCart(Integer cartId) {
        System.out.println("[DEBUG] CartService.getOrCreateCart - START - input cartId: " + cartId);
        
        try {
            if (cartId != null) {
                // Try to find existing cart
                try {
                    Optional<Cart> existingCart = cartRepo.findById(cartId);
                    if (existingCart.isPresent()) {
                        Cart found = existingCart.get();
                        System.out.println("[DEBUG] CartService.getOrCreateCart - Found existing cart: " + found.getCartId());
                        return found;
                    } else {
                        System.out.println("[DEBUG] CartService.getOrCreateCart - Cart ID " + cartId + " not found, creating new cart");
                    }
                } catch (Exception e) {
                    System.err.println("[ERROR] CartService.getOrCreateCart - Error finding cart: " + e.getMessage());
                    // Continue to create new cart
                }
            }
            
            // Create new cart
            System.out.println("[DEBUG] CartService.getOrCreateCart - Creating new cart");
            Cart newCart = new Cart();
            newCart.setCreatedAt(Instant.now());
            
            try {
                Cart savedCart = cartRepo.save(newCart);
                System.out.println("[DEBUG] CartService.getOrCreateCart - New cart saved with ID: " + savedCart.getCartId());
                return savedCart;
            } catch (Exception e) {
                System.err.println("[ERROR] CartService.getOrCreateCart - Failed to save new cart: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Failed to create cart", e);
            }
            
        } catch (RuntimeException e) {
            throw e; // Re-throw runtime exceptions
        } catch (Exception e) {
            System.err.println("[ERROR] CartService.getOrCreateCart - Unexpected exception: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Unexpected error in getOrCreateCart", e);
        }
    }

    /**
     * Add a product (or increment) to the cart.
     */
    @Transactional
    public CartView addItem(Integer rawCartId, CartItemRequest req) {
        System.out.println("[DEBUG] CartService.addItem - START - cartId: " + rawCartId + ", productId: " + req.productId() + ", quantity: " + req.quantity());
        
        try {
            // Step 1: Validate input
            if (req.productId() == null) {
                throw new IllegalArgumentException("Product ID cannot be null");
            }
            if (req.quantity() <= 0) {
                throw new IllegalArgumentException("Quantity must be positive");
            }
            
            // Step 2: Find or create cart
            Cart cart;
            try {
                cart = getOrCreateCart(rawCartId);
                System.out.println("[DEBUG] CartService.addItem - Got cart with ID: " + cart.getCartId());
            } catch (Exception e) {
                System.err.println("[ERROR] CartService.addItem - Failed to get/create cart: " + e.getMessage());
                throw new RuntimeException("Failed to create cart", e);
            }
            
            // Step 3: Validate product exists
            Product product;
            try {
                product = productRepo.findById(req.productId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + req.productId()));
                System.out.println("[DEBUG] CartService.addItem - Found product: " + product.getName());
            } catch (Exception e) {
                System.err.println("[ERROR] CartService.addItem - Product lookup failed: " + e.getMessage());
                throw e;
            }
            
            // Step 4: Handle cart item creation/update
            CartItem item = null;
            try {
                // Try to find existing item
                Optional<CartItem> existingItem = itemRepo.findByCart_CartIdAndProduct_ProductId(
                    cart.getCartId(), product.getProductId()
                );
                
                if (existingItem.isPresent()) {
                    // Update existing item
                    item = existingItem.get();
                    int oldQuantity = item.getQuantity();
                    item.setQuantity(oldQuantity + req.quantity());
                    System.out.println("[DEBUG] CartService.addItem - Updating existing item from " + oldQuantity + " to " + item.getQuantity());
                } else {
                    // Create new item
                    item = new CartItem();
                    item.setCart(cart);
                    item.setProduct(product);
                    item.setQuantity(req.quantity());
                    item.setGuestId(1); // Default guest ID for anonymous users
                    item.setAddedAt(Instant.now());
                    System.out.println("[DEBUG] CartService.addItem - Creating new cart item with quantity: " + req.quantity());
                }
                
                // Save the item
                CartItem savedItem = itemRepo.save(item);
                System.out.println("[DEBUG] CartService.addItem - Saved cart item with ID: " + savedItem.getCartItemId());
                
            } catch (Exception e) {
                System.err.println("[ERROR] CartService.addItem - Failed to save cart item: " + e.getClass().getSimpleName() + ": " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Failed to save cart item: " + e.getMessage(), e);
            }
            
            // Step 5: Build and return cart view
            try {
                CartView result = buildView(cart.getCartId());
                System.out.println("[DEBUG] CartService.addItem - SUCCESS - Cart now has " + result.lines().size() + " items");
                return result;
            } catch (Exception e) {
                System.err.println("[ERROR] CartService.addItem - Failed to build cart view: " + e.getMessage());
                throw new RuntimeException("Failed to build cart view: " + e.getMessage(), e);
            }
            
        } catch (Exception e) {
            System.err.println("[ERROR] CartService.addItem - FAILED: " + e.getClass().getSimpleName() + ": " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Build the current cart view.
     */
    @Transactional(readOnly = true)
    public CartView buildView(Integer cartId) {
        if (cartId == null) {
            // Return empty cart view if no cart ID
            return new CartView("", new ArrayList<>(), BigDecimal.ZERO, BigDecimal.ZERO);
        }
        
        List<CartItem> items = itemRepo.findByCart_CartId(cartId);
        BigDecimal subTotal = BigDecimal.ZERO;
        List<CartView.CartLine> lines = new ArrayList<>();

        for (CartItem ci : items) {
            BigDecimal lineTotal = ci.getProduct().getPrice()
                                        .multiply(BigDecimal.valueOf(ci.getQuantity()));
            subTotal = subTotal.add(lineTotal);
            String mainImageUrl = null;
            if (ci.getProduct().getImages() != null && !ci.getProduct().getImages().isEmpty()) {
                mainImageUrl = ci.getProduct().getImages().get(0).getImageUrl();
            }
            
            lines.add(new CartView.CartLine(
                ci.getCartItemId(),
                ci.getProduct().getProductId(),
                ci.getProduct().getProductCode(),
                ci.getProduct().getName(),
                mainImageUrl,
                ci.getProduct().getPrice(),
                ci.getQuantity(),
                lineTotal
            ));
        }

        return new CartView(cartId.toString(), lines, subTotal, subTotal);
    }

    /**
     * Update quantity by cart-item ID (deletes if qty ≤ 0).
     */
    @Transactional
    public CartView updateQty(Integer itemId, int qty) {
        CartItem item = itemRepo.findById(itemId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Cart item not found: " + itemId));

        if (qty <= 0) {
            itemRepo.delete(item);
        } else {
            item.setQuantity(qty);
            itemRepo.save(item);
        }
        return buildView(item.getCart().getCartId());
    }

    /**
     * Update by productId (deletes if qty ≤ 0).
     */
    @Transactional
    public CartView updateByProductId(Integer cartId, Integer productId, Integer quantity) {
        CartItem item = itemRepo
            .findByCart_CartIdAndProduct_ProductId(cartId, productId)
            .orElseThrow(() -> new IllegalArgumentException("Item not in cart"));

        if (quantity <= 0) {
            itemRepo.delete(item);
        } else {
            item.setQuantity(quantity);
            itemRepo.save(item);
        }
        return buildView(cartId);
    }

    /**
     * Remove a product from the cart.
     */
    @Transactional
    public CartView deleteByProductId(Integer cartId, Integer productId) {
        itemRepo.findByCart_CartIdAndProduct_ProductId(cartId, productId)
            .ifPresent(itemRepo::delete);
        return buildView(cartId);
    }

    /**
     * Fetch a single cart-item by productId.
     */
    @Transactional(readOnly = true)
    public Optional<CartItemDto> getItemByProductId(Integer cartId, Integer productId) {
        return itemRepo.findByCart_CartIdAndProduct_ProductId(cartId, productId)
                       .map(CartItemDto::from);
    }

    /**
     * Get total item count in the cart.
     */
    @Transactional(readOnly = true)
    public int getItemCount(Integer cartId) {
        return itemRepo.countByCart_CartId(cartId);
    }
}
