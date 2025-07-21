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
        log.info("Fetching all categories for public view using native query.");
        List<Object[]> rawCategories = categoryRepository.findAllCategoriesWithParentDetailsNative();
        log.info("Found {} raw categories for public view.", rawCategories.size());

        java.util.Map<Integer, CategoryPublicDto> categoryMap = new java.util.HashMap<>();

        for (Object[] row : rawCategories) {
            Integer categoryId = (Integer) row[0];
            String name = (String) row[1];
            String slug = (String) row[2];
            String description = (String) row[3];
            // row[4] is created_at, row[5] is is_active, row[6] is position - not directly used in CategoryPublicDto constructor
            Integer parentId = (Integer) row[7];
            String parentName = (String) row[8];

            CategoryPublicDto dto = new CategoryPublicDto(categoryId, name, slug, description);
            dto.setParentId(parentId);
            dto.setParentName(parentName);
            categoryMap.put(categoryId, dto);
        }

        List<CategoryPublicDto> rootCategories = new java.util.ArrayList<>();

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
}
