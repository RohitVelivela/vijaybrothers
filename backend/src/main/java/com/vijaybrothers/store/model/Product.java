package com.vijaybrothers.store.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {


    // ─── Primary key ───
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    // ─── Business columns ───
    @Column(name = "product_code", nullable = false, unique = true)
    private String productCode;

    private String name;

    @Column(unique = true)
    private String slug;

    @Column(length = 2000)
    private String description;

    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnore
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @Column(name = "is_in_stock")
    private Boolean inStock;

    @Column(name = "youtube_link")
    private String youtubeLink;

    // ─── Product attributes ───
    private String color;

    private String fabric;

    // ─── Audit ───
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "created_by", updatable = false)
    private String createdBy;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(nullable = false)
    private boolean deleted = false;

    // Getters
    public Integer getProductId() { return productId; }
    public String getProductCode() { return productCode; }
    public String getName() { return name; }
    public String getSlug() { return slug; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public Category getCategory() { return category; }
    public List<ProductImage> getImages() { return images; }
    public Integer getStockQuantity() { return stockQuantity; }
    public Boolean getInStock() { return inStock; }
    public String getYoutubeLink() { return youtubeLink; }
    public String getColor() { return color; }
    public String getFabric() { return fabric; }
    public Instant getCreatedAt() { return createdAt; }
    public String getCreatedBy() { return createdBy; }
    public Instant getUpdatedAt() { return updatedAt; }
    public String getUpdatedBy() { return updatedBy; }
    public boolean isDeleted() { return deleted; }

    // Setters
    public void setProductId(Integer productId) { this.productId = productId; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
    public void setName(String name) { this.name = name; }
    public void setSlug(String slug) { this.slug = slug; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setCategory(Category category) { this.category = category; }
    public void setImages(List<ProductImage> images) { this.images = images; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }
    public void setYoutubeLink(String youtubeLink) { this.youtubeLink = youtubeLink; }
    public void setColor(String color) { this.color = color; }
    public void setFabric(String fabric) { this.fabric = fabric; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
}