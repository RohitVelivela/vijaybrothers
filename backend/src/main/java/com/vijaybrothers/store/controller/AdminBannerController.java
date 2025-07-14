package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.*;
import com.vijaybrothers.store.service.BannerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/banners")
@RequiredArgsConstructor
public class AdminBannerController {

    private final BannerService svc;

    /**
     * POST /api/admin/banners
     * — Admin only: add a new banner
     */
    @PostMapping
    public ResponseEntity<BannerDto> create(
        @Valid @RequestBody BannerCreateRequest req
    ) {
        BannerDto dto = svc.createBanner(req);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(dto);
    }

    /**
     * PUT /api/admin/banners/{id}
     * — Admin only: update a banner by ID
     */
    @PutMapping("/{id}")
    public ResponseEntity<BannerDto> update(
            @PathVariable Long id,
            @Valid @RequestBody BannerUpdateDto dto
    ) {
        BannerDto updated = svc.updateBanner(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/admin/banners/{id}
     * — Admin only: delete a banner by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String,String>> delete(@PathVariable Integer id) {
        try {
            svc.deleteBanner(id);
            return ResponseEntity.ok(Map.of("message","Banner deleted successfully"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
        }
    }
}
