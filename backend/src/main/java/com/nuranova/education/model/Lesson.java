package com.nuranova.education.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 3000)
    private String description;

    @Column(nullable = false, length = 500)
    private String videoUrl;

    @Column(length = 120)
    private String videoSourceId;

    @Column(length = 255)
    private String videoStorageKey;

    @Column(length = 255)
    private String videoOriginalFilename;

    @Column(length = 120)
    private String videoMimeType;

    @Column(length = 50)
    private String durationLabel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AccessLevel accessLevel;

    @Column(nullable = false)
    private Integer sortOrder;

    @Column(nullable = false)
    private boolean published;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    public void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;

        if (sortOrder == null) {
            sortOrder = 0;
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = Instant.now();
    }
}
