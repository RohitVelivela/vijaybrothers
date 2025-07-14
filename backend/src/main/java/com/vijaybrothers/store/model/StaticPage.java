package com.vijaybrothers.store.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "static_pages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class StaticPage {

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