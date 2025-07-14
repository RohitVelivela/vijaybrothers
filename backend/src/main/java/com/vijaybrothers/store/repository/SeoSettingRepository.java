package com.vijaybrothers.store.repository;

import com.vijaybrothers.store.model.SeoSetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeoSettingRepository extends JpaRepository<SeoSetting, Integer> {
}