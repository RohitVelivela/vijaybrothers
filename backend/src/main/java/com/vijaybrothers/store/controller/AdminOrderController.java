package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.OrderDetailDto;
import com.vijaybrothers.store.dto.OrderListItem;
import com.vijaybrothers.store.dto.OrderStatusUpdateRequest;
import com.vijaybrothers.store.service.AdminOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final AdminOrderService svc;    @GetMapping
    public Page<OrderListItem> listOrders(
            @RequestParam(required = false) String status,
            Pageable pageable
    ) {
        return svc.listOrders(status, pageable);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDetailDto> getOrderDetail(@PathVariable Integer orderId) {
        try {
            OrderDetailDto dto = svc.getOrderDetail(orderId);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Integer orderId,
            @Valid @RequestBody OrderStatusUpdateRequest req
    ) {
        try {
            svc.updateOrderStatus(orderId, req);
            return ResponseEntity.ok(Map.of("message", "Order status updated successfully"));
            
        } catch (IllegalArgumentException e) {
            boolean isNotFound = e.getMessage().equals("Order not found");
            return ResponseEntity
                .status(isNotFound ? 404 : 400)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
