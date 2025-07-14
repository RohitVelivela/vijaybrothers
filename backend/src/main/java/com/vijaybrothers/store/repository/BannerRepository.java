package com.vijaybrothers.store.repository;

import com.vijaybrothers.store.model.Banner;
import com.vijaybrothers.store.model.BannerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Integer> {
    List<Banner> findByStatus(BannerStatus status);
}
