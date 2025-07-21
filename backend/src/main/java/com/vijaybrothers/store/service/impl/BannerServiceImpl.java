package com.vijaybrothers.store.service.impl;

import com.vijaybrothers.store.dto.BannerDto;
import com.vijaybrothers.store.dto.BannerCreateRequest;
import com.vijaybrothers.store.dto.BannerUpdateDto;
import com.vijaybrothers.store.model.Banner;
import com.vijaybrothers.store.repository.BannerRepository;
import com.vijaybrothers.store.service.BannerService;
import com.vijaybrothers.store.exception.ResourceNotFoundException;
import com.vijaybrothers.store.model.BannerStatus;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {

    private static final Logger log = LoggerFactory.getLogger(BannerServiceImpl.class);

    private final BannerRepository repository;

    @Override
    public BannerDto createBanner(BannerCreateRequest req) {
        Banner banner = new Banner();
        banner.setName(req.name());
        banner.setImage(req.image());
        banner.setLinkTo(req.linkTo());
        banner.setIsActive(req.isActive());
        banner.setDescription(req.description());
        banner.setCreatedAt(Instant.now());
        banner.setUpdatedAt(Instant.now());
        banner.setStatus(BannerStatus.ACTIVE);
        return mapToDto(repository.save(banner));
    }

    @Override
    public BannerDto updateBanner(Long id, BannerUpdateDto dto) {
        Banner banner = repository.findById(id.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found with id " + id));

        banner.setName(dto.getName());
        banner.setImage(dto.getImage());
        banner.setLinkTo(dto.getLinkTo());
        banner.setIsActive(dto.getIsActive());
        banner.setDescription(dto.getDescription());
        banner.setStatus(dto.getStatus());
        banner.setUpdatedAt(Instant.now());

        return mapToDto(repository.save(banner));
    }

    @Override
    public List<BannerDto> getActiveBanners() {
        log.info("Fetching active banners.");
        List<BannerDto> activeBanners = repository.findByStatus(BannerStatus.ACTIVE)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        log.info("Found {} active banners.", activeBanners.size());
        return activeBanners;
    }

    @Override
    public List<BannerDto> getAllBanners() {
        return repository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteBanner(Integer id) {
        repository.deleteById(id);
    }

    private BannerDto mapToDto(Banner banner) {
        return new BannerDto(
            banner.getBannerId(),
            banner.getName(),
            banner.getImage(),
            banner.getLinkTo(),
            banner.getStatus().name(),
            banner.getIsActive(),
            banner.getDescription(),
            banner.getCreatedAt(),
            banner.getUpdatedAt()
        );
    }
}
