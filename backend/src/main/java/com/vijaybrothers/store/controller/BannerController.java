package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.BannerCreateRequest;
import com.vijaybrothers.store.dto.BannerDto;
import com.vijaybrothers.store.dto.BannerUpdateDto;
import com.vijaybrothers.store.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/banners")
@Validated
public class BannerController {

    @Autowired
    private BannerService bannerService;

    @GetMapping
    public ResponseEntity<List<BannerDto>> getAllBanners() {
        List<BannerDto> banners = bannerService.getAllBanners();
        return ResponseEntity.ok(banners);
    }

    @PostMapping
    public ResponseEntity<BannerDto> createBanner(@Valid @RequestBody BannerCreateRequest request) {
        BannerDto createdBanner = bannerService.createBanner(request);
        return ResponseEntity.ok(createdBanner);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BannerDto> updateBanner(@PathVariable Long id, @Valid @RequestBody BannerUpdateDto dto) {
        BannerDto updatedBanner = bannerService.updateBanner(id, dto);
        return ResponseEntity.ok(updatedBanner);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable Integer id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }
}
