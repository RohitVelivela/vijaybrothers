package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.CategoryPublicDto;
import com.vijaybrothers.store.model.Category;
import com.vijaybrothers.store.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryPublicService {

    private final CategoryRepository categoryRepo;

    @Transactional(readOnly = true)
    public List<CategoryPublicDto> getActiveCategoriesHierarchy() {
        // Fetch all active main categories (where parent_id is NULL)
        List<Category> mainCategories = categoryRepo.findByParentCategoryIsNullAndIsActiveTrue();

        // Build the DTO hierarchy
        return mainCategories.stream()
                .sorted((c1, c2) -> c1.getPosition().compareTo(c2.getPosition()))
                .map(CategoryPublicDto::fromEntity)
                .collect(Collectors.toList());
    }
}
