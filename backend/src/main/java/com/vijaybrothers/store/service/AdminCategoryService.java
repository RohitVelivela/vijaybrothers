package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.CategoryCreateRequest;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface AdminCategoryService {
    void createCategory(CategoryCreateRequest request, MultipartFile image);
    void updateCategory(Integer id, CategoryCreateRequest request, MultipartFile image);
    void deleteCategory(Integer id);
}