package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.ProductDetail;
import com.vijaybrothers.store.dto.ProductListItem;
import com.vijaybrothers.store.model.Product;
import com.vijaybrothers.store.repository.ProductRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import com.vijaybrothers.store.dto.ProductImageDto;

@Service
public class ProductQueryService {

    private final ProductRepository repo;
    public ProductQueryService(ProductRepository repo) { this.repo = repo; }

    public Page<ProductListItem> list(Integer categoryId,
                                    String q,
                                    int page,
                                    int size)
    {
        Pageable pageable = PageRequest.of(page, size, Sort.by("productId").descending());
        return repo.search(categoryId, q, pageable).map(this::toDto);
    }

    @Transactional(readOnly = true)
    public ProductDetail getById(Integer id) {
        Product p = repo.findByIdWithCategoryAndImages(id)
            .orElseThrow(() -> new NoSuchElementException("Product not found"));

        // map images
        List<ProductDetail.ImageInfo> images = p.getImages().stream()
            .map(img -> new ProductDetail.ImageInfo(
                img.getImageUrl()
            ))
            .toList();

        // map category
        var c = p.getCategory();
        ProductDetail.CategoryInfo cat = c != null ? new ProductDetail.CategoryInfo(
            c.getCategoryId(),
            c.getName(),
            c.getSlug(),
            c.getDescription(),
            c.getCreatedAt()
        ) : null;

        return new ProductDetail(
            p.getProductId(),
            p.getProductCode(),
            p.getName(),
            p.getDescription(),
            p.getPrice(),
            p.getStockQuantity(),
            p.getInStock(),
            p.getYoutubeLink(),
            p.getCreatedAt(),
            p.getUpdatedAt(),
            p.getCreatedBy(),
            p.getUpdatedBy(),
            cat,
            images
        );
    }

    /* mapper */
    private ProductListItem toDto(Product p) {
        return new ProductListItem(
                p.getProductId(),
                p.getProductCode(),
                p.getName(),
                p.getPrice(),
                p.getInStock(),
                p.getYoutubeLink(),
                p.getCategory() != null ? p.getCategory().getName() : null,
                p.getColor(),
                p.getFabric(),
                p.getImages().stream().map(ProductImageDto::from).collect(Collectors.toList())
        );
    }
}