package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.*;
import com.vijaybrothers.store.model.SeoSetting;
import com.vijaybrothers.store.repository.SeoSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeoService {

    private final SeoSettingRepository repo;

    /** Admin: fetch all SEO settings */
    @Transactional(readOnly = true)
    public List<SeoSettingDto> listAll() {
        return repo.findAll().stream()
            .map(s -> new SeoSettingDto(
                s.getSeoId(),
                s.getPageType(),
                s.getReferenceId(),
                s.getMetaTitle(),
                s.getMetaDesc(),
                s.getMetaKeywords()
            ))
            .toList();
    }

    /** Admin: update meta fields */
    @Transactional
    public SeoSettingDto update(Integer seoId, SeoUpdateRequest req) {
        SeoSetting s = repo.findById(seoId)
            .orElseThrow(() -> new IllegalArgumentException("SEO setting not found"));
        s.setMetaTitle(req.metaTitle());
        s.setMetaDesc(req.metaDesc());
        s.setMetaKeywords(req.metaKeywords());
        SeoSetting saved = repo.save(s);
        return new SeoSettingDto(
            saved.getSeoId(),
            saved.getPageType(),
            saved.getReferenceId(),
            saved.getMetaTitle(),
            saved.getMetaDesc(),
            saved.getMetaKeywords()
        );
    }
}