package com.vijaybrothers.store.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for creating a new category
 * Used in POST /api/admin/categories
 */
public record CategoryCreateRequest(
    @NotBlank(message = "Category name cannot be blank")
    String name,

    @NotBlank(message = "Category slug cannot be blank")
    String slug,

    String description,

    Integer parentId,

    Boolean isActive,

    Integer position
) {}
