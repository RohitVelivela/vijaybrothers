package com.vijaybrothers.store.service.impl;

import com.vijaybrothers.store.dto.cart.CartView;
import com.vijaybrothers.store.dto.checkout.GuestCheckoutRequest;
import com.vijaybrothers.store.dto.checkout.GuestCheckoutResponse;
import com.vijaybrothers.store.dto.checkout.OrderCheckoutResponse;
import com.vijaybrothers.store.dto.PlaceOrderResponse;
import com.vijaybrothers.store.model.*;
import com.vijaybrothers.store.repository.*;
import com.vijaybrothers.store.service.CartService;
import com.vijaybrothers.store.service.CheckoutService;
import com.vijaybrothers.store.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CheckoutServiceImpl implements CheckoutService {

    private final GuestCheckoutDetailsRepository guestRepo;
    private final CartItemRepository cartItemRepo;
    private final OrderRepository orderRepo;
    private final OrderItemRepository orderItemRepo;
    private final ProductRepository productRepo;
    private final CartService cartService;
    private final PaymentService paymentService;

    @Override
    public GuestCheckoutResponse createGuest(Integer cartId, GuestCheckoutRequest request) {
        GuestCheckoutDetails entity = new GuestCheckoutDetails();
        entity.setName(request.name());
        entity.setEmail(request.email());
        entity.setPhone(request.phone());
        entity.setAddress(request.address());
        entity.setCity(request.city());
        entity.setState(request.state());
        entity.setPostalCode(request.postalCode());
        entity.setCreatedAt(OffsetDateTime.now());

        GuestCheckoutDetails saved = guestRepo.save(entity);
        cartItemRepo.assignGuestToCartItems(cartId, saved.getGuestId());
        return GuestCheckoutResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public OrderCheckoutResponse guestCheckout(Integer cartId, GuestCheckoutRequest req) {
        if (cartId == null) {
            throw new IllegalArgumentException("cartId is required");
        }

        CartView cart = cartService.buildView(cartId);
        if (cart.lines().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        GuestCheckoutDetails guestDetails = new GuestCheckoutDetails();
        guestDetails.setName(req.name());
        guestDetails.setEmail(req.email());
        guestDetails.setPhone(req.phone());
        guestDetails.setAddress(req.address());
        guestDetails.setCity(req.city());
        guestDetails.setState(req.state());
        guestDetails.setPostalCode(req.postalCode());
        guestDetails.setCreatedAt(OffsetDateTime.now());
        guestDetails = guestRepo.save(guestDetails);

        String orderNumber = generateOrderNumber();
        String fullAddress = String.format("%s, %s, %s %s", req.address(), req.city(), req.state(), req.postalCode());

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .guestCheckoutDetails(guestDetails)
                .customerEmail(req.email())
                .shippingName(req.name())
                .shippingEmail(req.email())
                .shippingPhone(req.phone())
                .shippingAddress(fullAddress)
                .totalAmount(cart.grandTotal())
                .paymentStatus(PaymentStatus.PENDING)
                .orderStatus(OrderStatus.PENDING)
                .createdAt(java.time.ZonedDateTime.now())
                .build();

        order = orderRepo.save(order);

        for (var line : cart.lines()) {
            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(productRepo.findById(line.productId())
                            .orElseThrow(() -> new IllegalArgumentException("Product not found")))
                    .quantity(line.quantity())
                    .unitPrice(line.price())
                    .build();
            orderItemRepo.save(item);
        }

        PlaceOrderResponse orderResponse = paymentService.createPaymentSession(order.getOrderId(), cart.grandTotal());
        return new OrderCheckoutResponse(order.getOrderId().intValue(), orderNumber, orderResponse.getOrderId().toString());
    }

    @Override
    public GuestCheckoutResponse getGuest(Integer guestId) {
        var entity = guestRepo.findById(guestId)
                .orElseThrow(() -> new IllegalArgumentException("Guest not found: " + guestId));
        return GuestCheckoutResponse.fromEntity(entity);
    }

    private String generateOrderNumber() {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String uniq = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "VB" + date + "-" + uniq;
    }
}
