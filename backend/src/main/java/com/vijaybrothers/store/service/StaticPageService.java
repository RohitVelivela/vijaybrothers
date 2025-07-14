package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.StaticPageDto;
import com.vijaybrothers.store.model.StaticPage;
import com.vijaybrothers.store.repository.StaticPageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StaticPageService {

    private final StaticPageRepository repo;

    @Transactional(readOnly = true)
    public StaticPageDto getPageBySlug(String slug) {
        StaticPage p = repo.findByPageSlug(slug)
            .orElseThrow(() -> new IllegalArgumentException("Page not found"));
        return new StaticPageDto(
            p.getPageSlug(),
            p.getTitle(),
            p.getContent(),
            p.getUpdatedAt()
        );
    }
}