package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.CategoryPublicDto;
import com.vijaybrothers.store.service.CategoryPublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/categories")
@RequiredArgsConstructor
public class CategoryPublicController {

    private final CategoryPublicService categoryPublicService;

    @GetMapping("/hierarchy")
    public ResponseEntity<List<CategoryPublicDto>> getCategoryHierarchy() {
        List<CategoryPublicDto> categories = categoryPublicService.getActiveCategoriesHierarchy();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/by-display-type")
    public ResponseEntity<List<CategoryPublicDto>> getCategoriesByDisplayType(@RequestParam String type) {
        List<CategoryPublicDto> categories = categoryPublicService.getPublicCategoriesByDisplayType(type);
        return ResponseEntity.ok(categories);
    }
}
