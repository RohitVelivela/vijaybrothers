package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.CategoryPublicDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryPublicService {

    private final CategoryService categoryService;

    @Transactional(readOnly = true)
    public List<CategoryPublicDto> getActiveCategoriesHierarchy() {
        return categoryService.getPublicCategories();
    }
}
