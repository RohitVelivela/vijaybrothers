package com.vijaybrothers.store.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.vijaybrothers.store.model.BannerStatus;

public class BannerUpdateDto {

    @NotBlank
    private String imageUrl;

    @NotBlank
    private String linkTo;

    @NotNull
    private BannerStatus status;

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getLinkTo() { return linkTo; }
    public void setLinkTo(String linkTo) { this.linkTo = linkTo; }

    public BannerStatus getStatus() { return status; }
    public void setStatus(BannerStatus status) { this.status = status; }
}
