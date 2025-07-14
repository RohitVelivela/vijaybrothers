package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.*;
import com.vijaybrothers.store.service.SeoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/seo")
@RequiredArgsConstructor
public class AdminSeoController {

    private final SeoService svc;

    /**
     * GET /api/admin/seo
     * — Admin only: list all SEO settings
     */
    @GetMapping
    public List<SeoSettingDto> listAll() {
        return svc.listAll();
    }

    /**
     * PUT /api/admin/seo/{seoId}
     * — Admin only: update meta_title, meta_desc, meta_keywords
     */
    @PutMapping("/{seoId}")
    public ResponseEntity<?> update(
        @PathVariable Integer seoId,
        @Valid @RequestBody SeoUpdateRequest req
    ) {
        try {
            SeoSettingDto dto = svc.update(seoId, req);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
        }
    }
}