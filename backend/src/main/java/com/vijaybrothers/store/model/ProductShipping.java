package com.vijaybrothers.store.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "product_shipping")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductShipping {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shipping_id")
    private Integer shippingId;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", unique = true)
    private Product product;
    
    @Column(name = "has_free_shipping")
    @Builder.Default
    private Boolean hasFreeShipping = false;
    
    @Column(name = "shipping_charge", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal shippingCharge = BigDecimal.ZERO;
    
    @Column(name = "is_heavy_item")
    @Builder.Default
    private Boolean isHeavyItem = false;
    
    @Column(name = "additional_charge", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal additionalCharge = BigDecimal.ZERO;
    
    // Audit fields
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
    
    @Column(name = "updated_at")
    private Instant updatedAt;
    
    @Column(name = "updated_by")
    private String updatedBy;
    
    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}