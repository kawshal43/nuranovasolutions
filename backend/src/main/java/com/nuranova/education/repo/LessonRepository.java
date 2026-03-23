package com.nuranova.education.repo;

import com.nuranova.education.model.Lesson;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findAllByCourseIdOrderBySortOrderAsc(Long courseId);
    Optional<Lesson> findByIdAndCourseId(Long id, Long courseId);
}
