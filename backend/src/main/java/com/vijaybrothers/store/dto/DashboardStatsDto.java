package com.vijaybrothers.store.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class DashboardStatsDto {
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long lowStockCount;
    private long totalProducts;
}