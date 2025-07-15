package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.DashboardStatsDto;
import com.vijaybrothers.store.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;

    /** Low-stock cutoff from properties (default 5) */
    @Value("${app.lowStockThreshold:5}")
    private int lowStockThreshold;

    /** Gather admin stats: total orders, revenue, low-stock count, total products */
    @Transactional(readOnly = true)
    public DashboardStatsDto getStats() {
        long totalOrders = orderRepo.count();
        var totalRevenue = orderRepo.sumTotalAmount();
        long lowStockCount = productRepo.findByStockQuantityLessThanAndDeletedFalse(lowStockThreshold).size();
        long totalProducts = productRepo.count();

        return new DashboardStatsDto(
            totalOrders,
            totalRevenue,
            lowStockCount,
            totalProducts
        );
    }
}