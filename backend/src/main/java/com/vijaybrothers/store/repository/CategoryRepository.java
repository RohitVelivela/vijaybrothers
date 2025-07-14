package com.vijaybrothers.store.repository;

import com.vijaybrothers.store.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    /**
     * Check if a category with the given slug exists
     */
    boolean existsBySlug(String slug);
}
