package com.vijaybrothers.store.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "banners")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "banner_id")
    private Integer bannerId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "image", nullable = false)
    private String image;

    @Column(name = "link_to", nullable = false)
    private String linkTo;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "description")
    private String description;
    
    @Column(name = "banner_type")
    private String bannerType; // HERO or PROMOTIONAL
    
    @Column(name = "section_name")
    private String sectionName; // For promotional banners - which section to display under
    
    @Column(name = "display_order")
    private Integer displayOrder; // Order of display within the section

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BannerStatus status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Integer getBannerId() { return bannerId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getLinkTo() { return linkTo; }
    public void setLinkTo(String linkTo) { this.linkTo = linkTo; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public String getBannerType() { return bannerType; }
    public void setBannerType(String bannerType) { this.bannerType = bannerType; }
    public String getSectionName() { return sectionName; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public BannerStatus getStatus() { return status; }
    public void setStatus(BannerStatus status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
