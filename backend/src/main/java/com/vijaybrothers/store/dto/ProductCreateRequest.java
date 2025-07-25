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
public class ProductCreateRequest {
    @NotBlank
    private String productCode;

    @NotBlank
    private String name;

    @Size(max = 2000)
    private String description;

    @NotNull @Positive
    private BigDecimal price;

    @NotNull
    private Integer categoryId;

    @NotNull @Min(0)
    private Integer stockQuantity;

    @NotNull
    private Boolean inStock;            // renamed

    private String youtubeLink;

}
