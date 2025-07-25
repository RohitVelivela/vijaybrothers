package com.vijaybrothers.store.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdateRequest {
    private Integer productId;
    private String productCode;
    private String name;
    @Size(max = 2000)
    private String description;
    @Positive
    private BigDecimal price;
    private Integer categoryId;
    @Min(0)
    private Integer stockQuantity;
    private Boolean inStock;
    private String youtubeLink;
}