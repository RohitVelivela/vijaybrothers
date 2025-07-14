package com.vijaybrothers.store.dto;

public record SeoSettingDto(
    Integer seoId,
    String  pageType,
    Integer referenceId,
    String  metaTitle,
    String  metaDesc,
    String  metaKeywords
) {}