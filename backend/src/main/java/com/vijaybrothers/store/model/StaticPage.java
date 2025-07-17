package com.vijaybrothers.store.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "static_pages")
@NoArgsConstructor @AllArgsConstructor
public class StaticPage {

    public String getPageSlug() { return pageSlug; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public Instant getUpdatedAt() { return updatedAt; }


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "page_id")
    private Integer pageId;

    @Column(name = "page_slug", nullable = false, unique = true)
    private String pageSlug;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}