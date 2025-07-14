package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.DashboardStatsDto;
import com.vijaybrothers.store.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final DashboardService svc;

    /**
     * GET /api/admin/dashboard/stats
     * → Admin only: return overall sales & stock analytics
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats() {
        DashboardStatsDto stats = svc.getStats();
        return ResponseEntity.ok(stats);
    }
}