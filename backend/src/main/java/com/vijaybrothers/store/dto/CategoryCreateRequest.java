package com.vijaybrothers.store.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;

/**
 * Basic fields for creating/updating a Category.
 */
public class CategoryCreateRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Slug is required")
    private String slug;

    private String description;
    private Integer parentId;

    @NotNull(message = "isActive flag is required")
    private Boolean isActive;

    private Integer position;
    private String categoryImage;
    private Integer categoryId;
    private Integer displayOrder;
    private String displayTypes; // New field for display types as JSON string

    // getters & setters...
    public String getCategoryImage() {
        return categoryImage;
    }

    public void setCategoryImage(String categoryImage) {
        this.categoryImage = categoryImage;
    }
    public Integer getCategoryId() {
        return categoryId;
    }
    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }
    public Integer getDisplayOrder() {
        return displayOrder;
    }
    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public String getDisplayTypes() {
        return displayTypes;
    }

    public void setDisplayTypes(String displayTypes) {
        this.displayTypes = displayTypes;
    }
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    private Boolean isParentCategory;

    public Boolean getIsParentCategory() {
        return isParentCategory;
    }

    public void setIsParentCategory(Boolean isParentCategory) {
        this.isParentCategory = isParentCategory;
    }
}