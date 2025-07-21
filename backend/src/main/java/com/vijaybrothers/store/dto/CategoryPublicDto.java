package com.vijaybrothers.store.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CategoryPublicDto {
    private Integer categoryId;
    private String name;
    private String slug;
    private String description;
    private Integer parentId;
    private String parentName;
    private List<CategoryPublicDto> subCategories = new ArrayList<>();

    // Constructor for mapping from Category entity
    public CategoryPublicDto(Integer categoryId, String name, String slug, String description) {
        this.categoryId = categoryId;
        this.name = name;
        this.slug = slug;
        this.description = description;
    }

    public static CategoryPublicDto fromEntity(com.vijaybrothers.store.model.Category category) {
        CategoryPublicDto dto = new CategoryPublicDto(
                category.getCategoryId(),
                category.getName(),
                category.getSlug(),
                category.getDescription()
        );
        if (category.getParentCategory() != null) {
            dto.setParentId(category.getParentCategory().getCategoryId());
            dto.setParentName(category.getParentCategory().getName());
        }
        // Recursively add subcategories
        if (category.getSubCategories() != null && !category.getSubCategories().isEmpty()) {
            for (com.vijaybrothers.store.model.Category subCategory : category.getSubCategories()) {
                dto.getSubCategories().add(fromEntity(subCategory));
            }
        }
        return dto;
    }
}