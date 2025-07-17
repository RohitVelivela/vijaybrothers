package com.vijaybrothers.store.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ProductDetail(
    Integer          productId,
    String           productCode,
    String           name,
    String           description,
    BigDecimal       price,
    Integer          stockQuantity,
    Boolean          inStock,
    String           youtubeLink,
    Instant          createdAt,
    Instant          updatedAt,
    String           createdBy,
    String           updatedBy,
    CategoryInfo     category,
    List<ImageInfo>  images
) {
  public record CategoryInfo(
      Integer categoryId,
      String  name,
      String  slug,
      String  description,
      Instant createdAt
  ) {}

  public record ImageInfo(
      String  imageUrl
  ) {}
}
