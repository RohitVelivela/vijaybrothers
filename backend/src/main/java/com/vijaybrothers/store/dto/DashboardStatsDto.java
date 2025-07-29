package com.vijaybrothers.store.dto;

import lombok.*;

import java.math.BigDecimal;

public class DashboardStatsDto {
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long lowStockCount;
    private long totalProducts;

    public DashboardStatsDto(long totalOrders, BigDecimal totalRevenue, long lowStockCount, long totalProducts) {
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.lowStockCount = lowStockCount;
        this.totalProducts = totalProducts;
    }
}