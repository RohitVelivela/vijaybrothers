package com.vijaybrothers.store.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminCategoryDto {
    private Integer categoryId;
    private String name;
    private String slug;
    private String description;
    private Boolean isActive;
    private Integer position;
    private Integer parentId;
    private String parentName;
}
