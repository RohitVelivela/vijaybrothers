package com.vijaybrothers.store.repository;

import com.vijaybrothers.store.model.ShippingConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ShippingConfigurationRepository extends JpaRepository<ShippingConfiguration, Integer> {
    // Get the latest configuration (there should only be one active config)
    Optional<ShippingConfiguration> findTopByOrderByConfigIdDesc();
}