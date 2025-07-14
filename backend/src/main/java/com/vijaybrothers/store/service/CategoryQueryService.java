package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.CategoryItem;
import com.vijaybrothers.store.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryQueryService {

    private final CategoryRepository repo;
    public CategoryQueryService(CategoryRepository repo){ this.repo = repo; }

    public List<CategoryItem> listAll() {
        return repo.findAll().stream()
                   .map(c -> new CategoryItem(c.getCategoryId(), c.getName()))
                   .toList();
    }
}
