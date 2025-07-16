package com.vijaybrothers.store.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.vijaybrothers.store.model.BannerStatus;

public class BannerUpdateDto {

    @NotBlank
    private String name;

    @NotBlank
    private String image;

    @NotBlank
    private String linkTo;

    @NotNull
    private BannerStatus status;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getLinkTo() { return linkTo; }
    public void setLinkTo(String linkTo) { this.linkTo = linkTo; }

    public BannerStatus getStatus() { return status; }
    public void setStatus(BannerStatus status) { this.status = status; }
}

