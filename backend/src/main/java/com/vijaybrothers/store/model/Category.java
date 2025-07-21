package com.vijaybrothers.store.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoryId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "category_image", columnDefinition = "TEXT")
    private String categoryImage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @JsonIgnore
    private Category parentCategory;

    @Column(name = "is_active", nullable = true)
    private Boolean isActive;

    @Column(nullable = false)
    private Integer position;

    @Column(nullable = false)
    private Integer displayOrder;

    

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "parentCategory", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Category> subCategories;

    // Getters
    public Integer getCategoryId() { return categoryId; }
    public String getName() { return name; }
    public String getSlug() { return slug; }
    public String getDescription() { return description; }
    public Category getParentCategory() { return parentCategory; }
    public Boolean getIsActive() { return isActive; }
    public Integer getPosition() { return position; }
    public Integer getDisplayOrder() { return displayOrder; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public List<Category> getSubCategories() { return subCategories; }
    public String getCategoryImage() { return categoryImage; }

    // Setters
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }
    public void setName(String name) { this.name = name; }
    public void setSlug(String slug) { this.slug = slug; }
    public void setDescription(String description) { this.description = description; }
    public void setParentCategory(Category parentCategory) { this.parentCategory = parentCategory; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public void setPosition(Integer position) { this.position = position; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public void setSubCategories(List<Category> subCategories) { this.subCategories = subCategories; }
    public void setCategoryImage(String categoryImage) { this.categoryImage = categoryImage; }

    @PrePersist
    protected void onCreate() {
        if (this.isActive == null) { // Check if it's explicitly set to false
            this.isActive = true;
        }
        if (this.position == null) {
            this.position = 0; // Default position
        }
        if (this.displayOrder == null) {
            this.displayOrder = 0; // Default display order
        }
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
