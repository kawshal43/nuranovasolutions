package com.nuranova.education.repo;

import com.nuranova.education.model.LessonAccessGrant;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonAccessGrantRepository extends JpaRepository<LessonAccessGrant, Long> {
    Optional<LessonAccessGrant> findByUserIdAndLessonId(Long userId, Long lessonId);
    boolean existsByUserIdAndLessonIdAndAllowedTrue(Long userId, Long lessonId);
}
