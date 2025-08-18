package com.vijaybrothers.store.repository;

import com.vijaybrothers.store.model.ProductShipping;
import com.vijaybrothers.store.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ProductShippingRepository extends JpaRepository<ProductShipping, Integer> {
    Optional<ProductShipping> findByProduct(Product product);
    
    Optional<ProductShipping> findByProductProductId(Integer productId);
    
    @Query("SELECT ps FROM ProductShipping ps JOIN FETCH ps.product")
    List<ProductShipping> findAllWithProducts();
    
    @Query("SELECT ps FROM ProductShipping ps WHERE ps.hasFreeShipping = :hasFreeShipping")
    List<ProductShipping> findByHasFreeShipping(@Param("hasFreeShipping") Boolean hasFreeShipping);
}