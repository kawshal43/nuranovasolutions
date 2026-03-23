package com.nuranova.education.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "lesson_progress")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(nullable = false)
    private boolean completed;

    @Column
    private Instant completedAt;

    @Column(nullable = false)
    private Instant lastViewedAt;

    @PrePersist
    public void onCreate() {
        Instant now = Instant.now();
        lastViewedAt = now;
    }

    @PreUpdate
    public void onUpdate() {
        lastViewedAt = Instant.now();
    }
}
