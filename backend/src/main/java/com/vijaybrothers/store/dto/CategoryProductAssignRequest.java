package com.vijaybrothers.store.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/**
 * Request DTO for assigning multiple products to a category
 * Used in POST /api/admin/categories/{categoryId}/products
 */
public record CategoryProductAssignRequest(
    @NotEmpty(message = "Product IDs list must not be empty")
    List<Integer> productIds
) {}
