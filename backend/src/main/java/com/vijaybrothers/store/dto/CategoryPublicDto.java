package com.vijaybrothers.store.dto;

import com.vijaybrothers.store.model.Category;
import lombok.Builder;
import java.util.List;
import java.util.stream.Collectors;

@Builder
public record CategoryPublicDto(
    Integer categoryId,
    String name,
    String slug,
    String description,
    Integer parentId,
    Integer position,
    List<CategoryPublicDto> subCategories
) {
    public static CategoryPublicDto fromEntity(Category category) {
        return CategoryPublicDto.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .parentId(category.getParentCategory() != null ? category.getParentCategory().getCategoryId() : null)
                .position(category.getPosition())
                .subCategories(category.getSubCategories() != null ?
                        category.getSubCategories().stream()
                                .filter(Category::isActive)
                                .sorted((c1, c2) -> c1.getPosition().compareTo(c2.getPosition()))
                                .map(CategoryPublicDto::fromEntity)
                                .collect(Collectors.toList()) : List.of())
                .build();
    }
}
