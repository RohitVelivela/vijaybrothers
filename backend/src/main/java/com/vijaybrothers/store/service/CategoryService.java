package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.CategoryDto;
import com.vijaybrothers.store.dto.CategoryPublicDto;
import com.vijaybrothers.store.model.Category;
import com.vijaybrothers.store.repository.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CategoryService {

    private static final Logger log = LoggerFactory.getLogger(CategoryService.class);

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryDto> getCategories() {
        log.info("Fetching all active categories from repository.");
        List<Category> allCategories = categoryRepository.findByParentCategoryIsNullAndIsActiveTrue();
        log.info("Found {} active categories: {}", allCategories.size(), allCategories.stream().map(Category::getName).collect(Collectors.toList()));

        // Create a map for quick lookup by categoryId
        java.util.Map<Integer, CategoryDto> categoryMap = allCategories.stream()
                .collect(Collectors.toMap(Category::getCategoryId, this::convertToDto));

        List<CategoryDto> rootCategories = new java.util.ArrayList<>();

        for (Category category : allCategories) {
            CategoryDto categoryDto = categoryMap.get(category.getCategoryId());
            if (category.getParentCategory() == null) {
                // This is a root category
                rootCategories.add(categoryDto);
            } else {
                // This is a sub-category, add it to its parent's subCategories list
                CategoryDto parentDto = categoryMap.get(category.getParentCategory().getCategoryId());
                if (parentDto != null) {
                    if (parentDto.getSubCategories() == null) {
                        parentDto.setSubCategories(new java.util.ArrayList<>());
                    }
                    parentDto.getSubCategories().add(categoryDto);
                }
            }
        }
        log.info("Returning {} root categories: {}", rootCategories.size(), rootCategories.stream().map(dto -> dto.getName()).collect(Collectors.toList()));
        return rootCategories;
    }

    private CategoryDto convertToDto(Category category) {
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setCategoryId(category.getCategoryId());
        categoryDto.setName(category.getName());
        categoryDto.setSlug(category.getSlug());
        if (category.getParentCategory() != null) {
            categoryDto.setParentId(category.getParentCategory().getCategoryId());
        }
        if (category.getSubCategories() != null && !category.getSubCategories().isEmpty()) {
            categoryDto.setSubCategories(category.getSubCategories().stream().map(this::convertToDto).collect(Collectors.toList()));
        }
        return categoryDto;
    }

    @Transactional(readOnly = true)
    public List<CategoryPublicDto> getPublicCategories() {
        log.info("Fetching all active categories for public view.");
        List<Category> allCategories = categoryRepository.findAll(); // Fetch all categories

        java.util.Map<Integer, CategoryPublicDto> categoryMap = new java.util.HashMap<>();

        // First pass: create DTOs and populate map
        for (Category category : allCategories) {
            CategoryPublicDto dto = CategoryPublicDto.fromEntity(category);
            categoryMap.put(category.getCategoryId(), dto);
        }

        List<CategoryPublicDto> rootCategories = new java.util.ArrayList<>();

        // Second pass: build hierarchy
        for (CategoryPublicDto dto : categoryMap.values()) {
            if (dto.getParentId() == null) {
                rootCategories.add(dto);
            } else {
                CategoryPublicDto parentDto = categoryMap.get(dto.getParentId());
                if (parentDto != null) {
                    parentDto.getSubCategories().add(dto);
                }
            }
        }
        log.info("Returning {} root categories for public view.", rootCategories.size());
        return rootCategories;
    }

    @Transactional(readOnly = true)
    public List<CategoryPublicDto> getPublicCategoriesByDisplayType(String displayType) {
        log.info("Fetching active categories for public view by display type: {}", displayType);
        List<Category> categories = categoryRepository.findByIsActiveTrueAndDisplayTypesContaining(displayType);
        return categories.stream()
                .map(CategoryPublicDto::fromEntity)
                .collect(Collectors.toList());
    }
}
