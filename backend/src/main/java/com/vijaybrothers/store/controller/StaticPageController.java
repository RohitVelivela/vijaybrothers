package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.StaticPageDto;
import com.vijaybrothers.store.service.StaticPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pages")
@RequiredArgsConstructor
public class StaticPageController {

    private final StaticPageService svc;

    /**
     * GET /api/pages/{slug}
     */
    @GetMapping("/{slug}")
    public ResponseEntity<?> getPage(@PathVariable String slug) {
        try {
            StaticPageDto page = svc.getPageBySlug(slug);
            return ResponseEntity.ok(page);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity
                .status(404)
                .body(Map.of("error", ex.getMessage()));
        }
    }
}