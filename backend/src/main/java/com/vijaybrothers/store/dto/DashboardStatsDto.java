
package com.vijaybrothers.store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private long totalOrders;
    private Double monthlyRevenue;
    private long productsInStock;
}
