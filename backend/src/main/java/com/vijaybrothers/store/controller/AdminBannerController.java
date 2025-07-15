package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.BannerCreateRequest;
import com.vijaybrothers.store.dto.BannerDto;
import com.vijaybrothers.store.dto.BannerUpdateDto;
import com.vijaybrothers.store.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/banners")
@RequiredArgsConstructor
public class AdminBannerController {

    private final BannerService bannerService;

    @PostMapping
    public ResponseEntity<BannerDto> createBanner(@RequestBody BannerCreateRequest bannerRequest) {
        BannerDto banner = bannerService.createBanner(bannerRequest);
        return new ResponseEntity<>(banner, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BannerDto> updateBanner(@PathVariable Long id, @RequestBody BannerUpdateDto bannerRequest) {
        BannerDto banner = bannerService.updateBanner(id, bannerRequest);
        return new ResponseEntity<>(banner, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<BannerDto>> getAllBanners() {
        List<BannerDto> banners = bannerService.getAllBanners();
        return new ResponseEntity<>(banners, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable Integer id) {
        bannerService.deleteBanner(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}