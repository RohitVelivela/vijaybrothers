package com.vijaybrothers.store.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // serve files under ./uploads/** at URL /uploads/**
        String uploadPath = Paths.get("uploads").toAbsolutePath().toUri().toString();
        registry
          .addResourceHandler("/uploads/**")
          .addResourceLocations(uploadPath);
    }
}
