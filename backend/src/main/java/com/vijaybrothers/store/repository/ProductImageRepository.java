package com.vijaybrothers.store.repository;

import com.vijaybrothers.store.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
}