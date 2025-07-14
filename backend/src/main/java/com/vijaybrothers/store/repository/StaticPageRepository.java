package com.vijaybrothers.store.repository;

import com.vijaybrothers.store.model.StaticPage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaticPageRepository extends JpaRepository<StaticPage,Integer> {
    Optional<StaticPage> findByPageSlug(String slug);
}