package com.vijaybrothers.store.repository;

import com.vijaybrothers.store.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findBySlug(String slug);
    boolean existsBySlug(String slug);
    List<Category> findByParentCategoryIsNullAndIsActiveTrue();

    @Query("SELECT c FROM Category c JOIN c.displayTypes dt WHERE c.isActive = true AND dt = :displayType")
    List<Category> findByIsActiveTrueAndDisplayTypesContaining(String displayType);

    @Query(value = """
        SELECT 
            c.category_id,
            c.name AS category_name,
            c.slug,
            c.description,
            c.created_at,
            c.is_active,
            c.position,
            p.category_id AS parent_id,
            p.name AS parent_name
        FROM 
            categories c
        LEFT JOIN 
            categories p ON c.parent_id = p.category_id
        ORDER BY 
            COALESCE(p.category_id, c.category_id), 
            c.position ASC, 
            c.category_id
    """, nativeQuery = true)
    List<Object[]> findAllCategoriesWithParentDetailsNative();
}