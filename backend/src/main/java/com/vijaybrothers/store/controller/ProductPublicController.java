package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.ProductListItem;
import com.vijaybrothers.store.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Public product listing endpoints")
@RequiredArgsConstructor
public class ProductPublicController {

    private final ProductRepository productRepo;

    /**
     * GET /api/products
     *
     * Query-params (all optional):
     *   page        default 0
     *   size        default 20
     *   categoryId  filter by category
     *   q           full-text search in product name
     *   color       filter by color
     *   fabric      filter by fabric
     *   inStock     filter by stock status
     */
    @GetMapping
    @Operation(summary = "List products with optional filtering and pagination")
    public List<ProductListItem> listFiltered(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String fabric,
            @RequestParam(required = false) Boolean inStock
    ) {
        var products = productRepo.filterProducts(categoryId, color, fabric, inStock);
        return products.stream().map(ProductListItem::from).toList();
    }
}
