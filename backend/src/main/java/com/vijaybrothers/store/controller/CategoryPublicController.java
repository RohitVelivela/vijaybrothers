package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.CategoryItem;
import com.vijaybrothers.store.service.CategoryQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/categories")
@Tag(name = "Categories", description = "Product categories endpoints")
public class CategoryPublicController {

    private final CategoryQueryService svc;
    public CategoryPublicController(CategoryQueryService svc){ this.svc = svc; }

    @Operation(
        summary = "List all categories",
        description = "Get a list of all product categories"
    )
    @GetMapping
    public List<CategoryItem> list() {
        return svc.listAll();
    }
}
