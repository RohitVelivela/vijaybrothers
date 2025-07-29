package com.vijaybrothers.store.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seo_settings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SeoSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seo_id")
    private Integer seoId;

    @Column(name = "page_type", nullable = false)
    private String pageType;

    @Column(name = "reference_id", nullable = false)
    private Integer referenceId;

    @Column(name = "meta_title", columnDefinition = "TEXT")
    private String metaTitle;

    @Column(name = "meta_desc", columnDefinition = "TEXT")
    private String metaDesc;

    @Column(name = "meta_keywords", columnDefinition = "TEXT")
    private String metaKeywords;

    // Getters
    public Integer getSeoId() { return seoId; }
    public String getPageType() { return pageType; }
    public Integer getReferenceId() { return referenceId; }
    public String getMetaTitle() { return metaTitle; }
    public String getMetaDesc() { return metaDesc; }
    public String getMetaKeywords() { return metaKeywords; }

    // Setters
    public void setSeoId(Integer seoId) { this.seoId = seoId; }
    public void setPageType(String pageType) { this.pageType = pageType; }
    public void setReferenceId(Integer referenceId) { this.referenceId = referenceId; }
    public void setMetaTitle(String metaTitle) { this.metaTitle = metaTitle; }
    public void setMetaDesc(String metaDesc) { this.metaDesc = metaDesc; }
    public void setMetaKeywords(String metaKeywords) { this.metaKeywords = metaKeywords; }
}
