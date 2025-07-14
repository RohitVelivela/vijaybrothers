package com.vijaybrothers.store.service.impl;

import com.vijaybrothers.store.dto.OrderCreateRequest;
import com.vijaybrothers.store.dto.PlaceOrderResponse;
import com.vijaybrothers.store.dto.OrderSummaryDto;
import com.vijaybrothers.store.dto.OrderTrackDto;
import com.vijaybrothers.store.dto.OrderItemRequest;
import com.vijaybrothers.store.exception.ResourceNotFoundException;
import com.vijaybrothers.store.model.Order;
import com.vijaybrothers.store.model.OrderItem;
import com.vijaybrothers.store.model.OrderStatus;
import com.vijaybrothers.store.model.PaymentStatus;

import com.vijaybrothers.store.model.GuestCheckoutDetails;
import com.vijaybrothers.store.repository.OrderItemRepository;
import com.vijaybrothers.store.repository.OrderRepository;
import com.vijaybrothers.store.repository.GuestCheckoutDetailsRepository;
import com.vijaybrothers.store.service.OrderService;
import com.vijaybrothers.store.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepo;
    private final OrderItemRepository itemRepo;
    private final GuestCheckoutDetailsRepository guestRepo;
    private final PaymentService paymentService;

    @Override
    public PlaceOrderResponse placeOrder(OrderCreateRequest req) {
        String orderNumber = "ORD" + ZonedDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        BigDecimal total = BigDecimal.valueOf(req.totalAmount());

        GuestCheckoutDetails guestDetails = null;
        if (req.guestId() != null) {
            guestDetails = guestRepo.findById(req.guestId().intValue()).orElse(null);
        }

        Order order = Order.builder()
            .orderNumber(orderNumber)
            .guestCheckoutDetails(guestDetails)
            .totalAmount(total)
            .orderStatus(OrderStatus.PENDING)
            .paymentStatus(PaymentStatus.PENDING)
            .customerEmail(req.shippingEmail())
            .shippingName(req.shippingName())
            .shippingEmail(req.shippingEmail())
            .shippingPhone(req.shippingPhone())
            .shippingAddress(req.shippingAddress())
            .shippingCity(req.shippingCity())
            .shippingPostalCode(req.shippingPostalCode())
            .shippingState(req.shippingState())
            .createdAt(ZonedDateTime.now())
            .build();
        
        final Order savedOrder = orderRepo.save(order);

        // Save order items using traditional for loop to avoid lambda issues
        for (OrderItemRequest itemRequest : req.items()) {
            OrderItem orderItem = OrderItem.builder()
                .order(savedOrder)
                .productId(itemRequest.productId())
                .quantity(itemRequest.quantity())
                .unitPrice(itemRequest.unitPrice())
                .lineTotal(itemRequest.subTotal())
                .build();
            itemRepo.save(orderItem);
        }

        try {
            return paymentService.createOrder(savedOrder);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Order createOrder(Order order) {
        return orderRepo.save(order);
    }

    @Override
    public Page<OrderSummaryDto> getGuestOrders(Long guestId, Pageable pageable) {
        // Convert Long to Integer since GuestCheckoutDetails.guestId is Integer
        Integer guestIdInt = guestId != null ? guestId.intValue() : null;
        return orderRepo.findByGuestCheckoutDetailsGuestId(guestIdInt, pageable)
            .map(o -> new OrderSummaryDto(
                o.getOrderId(), 
                o.getOrderNumber(), 
                o.getTotalAmount(), 
                o.getOrderStatus().name(), 
                o.getCreatedAt()
            ));
    }

    @Override
    public OrderTrackDto trackOrder(Long orderId) {
        Order order = orderRepo.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + orderId));

        List<OrderTrackDto.OrderItemDetail> items = itemRepo.findByOrderOrderId(orderId)
            .stream()
            .map(item -> new OrderTrackDto.OrderItemDetail(
                item.getProductId(),
                item.getProduct() != null ? item.getProduct().getName() : "Unknown Product",
                item.getQuantity(),
                item.getUnitPrice(),
                item.getLineTotal()
            ))
            .collect(Collectors.toList());

        return new OrderTrackDto(
            order.getOrderId(), 
            order.getOrderNumber(), 
            order.getTotalAmount(), 
            order.getOrderStatus().name(), 
            order.getCreatedAt(),
            order.getShippingName(), 
            order.getShippingAddress(), 
            order.getShippingCity(), 
            order.getShippingPostalCode(), 
            order.getShippingState(), 
            items
        );
    }
}