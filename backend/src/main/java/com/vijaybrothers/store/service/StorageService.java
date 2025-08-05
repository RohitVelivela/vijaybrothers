package com.vijaybrothers.store.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    String store(MultipartFile file, String subfolder, String productName);
    String storeProductImage(MultipartFile file, String productName);
    void deleteFile(String fileName);
    void deleteProductImage(String imageUrl);

}