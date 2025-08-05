package com.vijaybrothers.store.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // serve files under /uploads/** at URL /uploads/** from the absolute path
        String uploadPath = "file:///C:/Users/rohit/Documents/Personal/vijaybrothers/frontend/public/uploads/";
        registry
          .addResourceHandler("/uploads/**")
          .addResourceLocations(uploadPath);
    }
}
