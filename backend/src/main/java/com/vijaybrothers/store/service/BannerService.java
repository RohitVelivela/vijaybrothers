package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.BannerDto;
import com.vijaybrothers.store.dto.BannerUpdateDto;
import com.vijaybrothers.store.dto.BannerCreateRequest;

import java.util.List;

public interface BannerService {
    BannerDto createBanner(BannerCreateRequest req);
    BannerDto updateBanner(Long id, BannerUpdateDto dto);
    List<BannerDto> getActiveBanners();
    List<BannerDto> getAllBanners();
    void deleteBanner(Integer id);
}
