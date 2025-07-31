package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.BannerDto;
import com.vijaybrothers.store.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@Validated
public class BannerController {

    @Autowired
    private BannerService bannerService;

    @GetMapping
    public ResponseEntity<List<BannerDto>> getAllBanners() {
        List<BannerDto> banners = bannerService.getActiveBanners();
        return ResponseEntity.ok(banners);
    }
}
