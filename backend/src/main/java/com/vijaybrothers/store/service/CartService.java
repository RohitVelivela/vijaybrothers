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
        if (cartId != null) {
            return cartRepo.findById(cartId)
                .orElseGet(() -> {
                    Cart c = new Cart();
                    c.setCreatedAt(Instant.now());
                    return cartRepo.save(c);
                });
        } else {
            Cart c = new Cart();
            c.setCreatedAt(Instant.now());
            return cartRepo.save(c);
        }
    }

    /**
     * Add a product (or increment) to the cart.
     */
    @Transactional
    public CartView addItem(Integer rawCartId, CartItemRequest req) {
        Cart cart = getOrCreateCart(rawCartId);
        Product product = productRepo.findById(req.productId())
            .orElseThrow(() -> new IllegalArgumentException(
                "Product not found: " + req.productId()));

        CartItem item = itemRepo
            .findByCart_CartIdAndProduct_ProductId(
                cart.getCartId(), product.getProductId()
            )
            .orElseGet(() -> {
                CartItem ci = new CartItem();
                ci.setCart(cart);
                ci.setProduct(product);
                ci.setQuantity(0);
                ci.setGuestId(null);              // not yet checked out
                ci.setAddedAt(Instant.now());
                return ci;
            });

        item.setQuantity(item.getQuantity() + req.quantity());
        itemRepo.save(item);
        return buildView(cart.getCartId());
    }

    /**
     * Build the current cart view.
     */
    @Transactional(readOnly = true)
    public CartView buildView(Integer cartId) {
        List<CartItem> items = itemRepo.findByCart_CartId(cartId);
        BigDecimal subTotal = BigDecimal.ZERO;
        List<CartView.CartLine> lines = new ArrayList<>();

        for (CartItem ci : items) {
            BigDecimal lineTotal = ci.getProduct().getPrice()
                                        .multiply(BigDecimal.valueOf(ci.getQuantity()));
            subTotal = subTotal.add(lineTotal);
            lines.add(new CartView.CartLine(
                ci.getCartItemId(),
                ci.getProduct().getProductId(),
                ci.getProduct().getName(),
                ci.getProduct().getImages().isEmpty() ? null : ci.getProduct().getImages().get(0).getImageUrl(),
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
