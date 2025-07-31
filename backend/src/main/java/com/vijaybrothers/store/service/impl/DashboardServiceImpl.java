
package com.vijaybrothers.store.service.impl;

import com.vijaybrothers.store.dto.DashboardStatsDto;
import com.vijaybrothers.store.repository.OrderRepository;
import com.vijaybrothers.store.repository.ProductRepository;
import com.vijaybrothers.store.service.DashboardService;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public DashboardServiceImpl(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Override
    public DashboardStatsDto getDashboardStats() {
        long totalOrders = orderRepository.count();
        Double monthlyRevenue = orderRepository.findTotalRevenueOfCurrentMonth().orElse(0.0);
        long productsInStock = productRepository.countByInStock(true);

        return new DashboardStatsDto(totalOrders, monthlyRevenue, productsInStock);
    }

    @Override
    public DashboardStatsDto getStats() {
        long totalOrders = orderRepository.count();
        Double monthlyRevenue = orderRepository.findTotalRevenueOfCurrentMonth().orElse(0.0);
        long productsInStock = productRepository.countByInStock(true);

        return new DashboardStatsDto(totalOrders, monthlyRevenue, productsInStock);
    }
}
