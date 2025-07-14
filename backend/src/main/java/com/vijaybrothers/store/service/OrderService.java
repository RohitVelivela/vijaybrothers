package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.OrderCreateRequest;
import com.vijaybrothers.store.dto.OrderSummaryDto;
import com.vijaybrothers.store.dto.OrderTrackDto;
import com.vijaybrothers.store.dto.PlaceOrderResponse;
import com.vijaybrothers.store.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {

    PlaceOrderResponse placeOrder(OrderCreateRequest request);

    Order createOrder(Order order);

    Page<OrderSummaryDto> getGuestOrders(Long guestId, Pageable pageable);

    OrderTrackDto trackOrder(Long orderId);
}