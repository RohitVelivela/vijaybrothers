package com.vijaybrothers.store.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "shipping_configuration")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingConfiguration {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "config_id")
    private Integer configId;
    
    // Global shipping settings
    @Column(name = "global_free_shipping")
    @Builder.Default
    private Boolean globalFreeShipping = false;
    
    @Column(name = "default_shipping_charge", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal defaultShippingCharge = BigDecimal.ZERO;
    
    @Column(name = "min_order_for_free_shipping", precision = 10, scale = 2)
    private BigDecimal minOrderForFreeShipping;
    
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