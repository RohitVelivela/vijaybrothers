package com.vijaybrothers.store.dto;

import com.vijaybrothers.store.model.Category;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CategoryDto {
    private Integer categoryId;
    private String name;
    private String slug;
    private String description;
    private Instant createdAt;
    private Integer parentId;
    private List<String> displayTypes; // New field
    private List<CategoryDto> subCategories = new ArrayList<>();

    public CategoryDto() {
        // Default constructor for Jackson
    }

    public CategoryDto(Integer categoryId, String name, String slug, String description, Instant createdAt) {
        this.categoryId = categoryId;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.createdAt = createdAt;
    }

    public static CategoryDto from(Category c) {
        CategoryDto dto = new CategoryDto();
        dto.setCategoryId(c.getCategoryId());
        dto.setName(c.getName());
        dto.setSlug(c.getSlug());
        dto.setDescription(c.getDescription());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setDisplayTypes(c.getDisplayTypes()); // Map displayTypes
        if (c.getParentCategory() != null) {
            dto.setParentId(c.getParentCategory().getCategoryId());
        }
        return dto;
    }
}
