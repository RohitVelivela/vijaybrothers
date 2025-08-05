package com.vijaybrothers.store.service;
import com.vijaybrothers.store.model.PaymentStatus;
import com.vijaybrothers.store.dto.OrderDetailDto;
import com.vijaybrothers.store.dto.OrderItemDto;
import com.vijaybrothers.store.dto.OrderListItem;
import com.vijaybrothers.store.dto.OrderStatusUpdateRequest;
import com.vijaybrothers.store.model.Order;
import com.vijaybrothers.store.model.OrderItem;
import com.vijaybrothers.store.model.OrderStatus;
import com.vijaybrothers.store.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminOrderService {

    private static final Logger log = LoggerFactory.getLogger(AdminOrderService.class);

    private final OrderRepository orderRepo;

    public Page<OrderListItem> list(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        OrderStatus orderStatus = status != null ? OrderStatus.valueOf(status) : null;

        Page<Order> ordersPage;
        if (orderStatus != null) {
            ordersPage = orderRepo.findByOrderStatus(orderStatus, pageable);
        } else {
            ordersPage = orderRepo.findAll(pageable);
        }

        log.info("Fetched {} orders from repository. Total elements: {}, Total pages: {}",
            ordersPage.getContent().size(), ordersPage.getTotalElements(), ordersPage.getTotalPages());
        ordersPage.getContent().forEach(order -> log.info("Order ID: {}, Customer: {}, Status: {}",
            order.getOrderId(), order.getShippingName(), order.getOrderStatus()));

        return ordersPage.map(this::toListItem);
    }

    /**
     * Get detailed information about a specific order
     * @param orderId The ID of the order to retrieve
     * @return OrderDetailDto containing full order information
     * @throws IllegalArgumentException if order not found
     */
    @Transactional(readOnly = true)
    public OrderDetailDto getOrderDetail(Integer orderId) {
        Order order = orderRepo.findById(orderId.longValue())
            .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        return new OrderDetailDto(
            order.getOrderId().intValue(),
            order.getOrderNumber(),
            order.getTotalAmount(),
            order.getOrderStatus().name(),
            order.getPaymentStatus().name(),
            order.getCreatedAt().toInstant(),
            order.getShippingName(),
            order.getShippingEmail(),
            order.getShippingPhone(),
            order.getShippingAddress(),
            "Razorpay", // Default payment method since all payments are via Razorpay
            order.getOrderItems().stream()
                .map(this::toItemDto)
                .collect(Collectors.toList())
        );
    }

    private OrderItemDto toItemDto(OrderItem item) {
        var quantity = item.getQuantity();
        var price = item.getUnitPrice();
        return new OrderItemDto(
            item.getProduct().getProductId(),
            item.getProduct().getName(),
            quantity,
            price,
            price.multiply(java.math.BigDecimal.valueOf(quantity))
        );
    }

    /**
     * Updates both order status and payment status for an existing order
     * 
     * @param orderId ID of the order to update
     * @param req Contains new orderStatus and paymentStatus values
     * @throws IllegalArgumentException if order not found or status values invalid
     */
    @Transactional
    public void updateOrderStatus(Integer orderId, OrderStatusUpdateRequest req) {
        // 1. Find and validate order exists
        Order order = orderRepo.findById(orderId.longValue())
            .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        // 2. Capture old status for logging
        OrderStatus oldOrderStatus = order.getOrderStatus();
        PaymentStatus oldPaymentStatus = order.getPaymentStatus();

        // 3. Validate and set new status values
        try {
            OrderStatus newOrderStatus = OrderStatus.valueOf(req.orderStatus());
            PaymentStatus newPaymentStatus = PaymentStatus.valueOf(req.paymentStatus());

            // 4. Validate status transitions
            validateStatusTransition(oldOrderStatus, newOrderStatus, oldPaymentStatus, newPaymentStatus);

            // 5. Update the order
            order.setOrderStatus(newOrderStatus);
            order.setPaymentStatus(newPaymentStatus);
            order.setUpdatedAt(Instant.now());

        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid orderStatus or paymentStatus value");
        }

        // 6. Save changes
        orderRepo.save(order);
    }

    /**
     * Validates if the status transition is allowed
     * Throws IllegalArgumentException if transition is invalid
     */
    private void validateStatusTransition(
            OrderStatus oldOrderStatus, 
            OrderStatus newOrderStatus,
            PaymentStatus oldPaymentStatus,
            PaymentStatus newPaymentStatus) {
        
        // Cannot update a cancelled order
        if (oldOrderStatus == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Cannot update a cancelled order");
        }

        // Cannot move back from DELIVERED status
        if (oldOrderStatus == OrderStatus.DELIVERED 
            && newOrderStatus != OrderStatus.DELIVERED
            && newOrderStatus != OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Cannot change status of delivered order");
        }

        // Cannot mark as delivered if not shipped
        if (newOrderStatus == OrderStatus.DELIVERED 
            && oldOrderStatus != OrderStatus.SHIPPED) {
            throw new IllegalArgumentException("Order must be shipped before delivery");
        }

        // Cannot mark as paid if already refunded
        if (oldPaymentStatus == PaymentStatus.REFUNDED 
            && newPaymentStatus == PaymentStatus.PAID) {
            throw new IllegalArgumentException("Cannot mark refunded payment as paid");
        }
    }

    /**
     * List all orders with optional status filter and pagination
     * 
     * @param status Optional order status filter
     * @param pageable Pagination information
     * @return Page of OrderListItem DTOs
     */
    @Transactional(readOnly = true)
    public Page<OrderListItem> listOrders(String status, Pageable pageable) {
        if (status != null && !status.isEmpty()) {
            try {
                OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
                return orderRepo.findByOrderStatus(orderStatus, pageable)
                    .map(this::toListItem);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid order status: " + status);
            }
        }
        return orderRepo.findAll(pageable)
            .map(this::toListItem);
    }

    /**
     * Updates only the order status for an existing order
     * 
     * @param orderId ID of the order to update
     * @param status New order status
     * @throws IllegalArgumentException if order not found or status invalid
     */
    @Transactional
    public void updateOrderStatusOnly(Integer orderId, String status) {
        // 1. Find and validate order exists
        Order order = orderRepo.findById(orderId.longValue())
            .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        // 2. Validate new status
        try {
            OrderStatus newOrderStatus = OrderStatus.valueOf(status.toUpperCase());
            
            // 3. Validate status transition
            validateOrderStatusTransition(order.getOrderStatus(), newOrderStatus);

            // 4. Update the order
            order.setOrderStatus(newOrderStatus);
            order.setUpdatedAt(Instant.now());

        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid order status: " + status);
        }

        // 5. Save changes
        orderRepo.save(order);
    }

    /**
     * Validates if the order status transition is allowed
     */
    private void validateOrderStatusTransition(OrderStatus oldStatus, OrderStatus newStatus) {
        // Cannot update a cancelled order
        if (oldStatus == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Cannot update a cancelled order");
        }

        // Cannot move back from DELIVERED status
        if (oldStatus == OrderStatus.DELIVERED 
            && newStatus != OrderStatus.DELIVERED
            && newStatus != OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Cannot change status of delivered order");
        }

        // Cannot mark as delivered if not shipped
        if (newStatus == OrderStatus.DELIVERED 
            && oldStatus != OrderStatus.SHIPPED) {
            throw new IllegalArgumentException("Order must be shipped before delivery");
        }
    }

    /**
     * Convert Order entity to OrderListItem DTO
     */
    private OrderListItem toListItem(Order order) {
        return new OrderListItem(
            order.getOrderId().intValue(),
            order.getOrderNumber(),
            order.getShippingName(),
            order.getTotalAmount(),
            order.getPaymentStatus().name(),
            order.getOrderStatus().name(),
            order.getCreatedAt().toInstant()
        );
    }
}
