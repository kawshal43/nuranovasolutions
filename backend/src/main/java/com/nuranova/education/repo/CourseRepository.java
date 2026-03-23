package com.nuranova.education.repo;

import com.nuranova.education.model.Course;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findAllByPublishedTrueOrderBySortOrderAsc();
    List<Course> findAllByOrderBySortOrderAsc();
    boolean existsBySlugIgnoreCase(String slug);
    Optional<Course> findBySlug(String slug);

    @EntityGraph(attributePaths = "lessons")
    @Query("select c from Course c where c.slug = :slug")
    Optional<Course> findBySlugWithLessons(String slug);

    @EntityGraph(attributePaths = "lessons")
    @Query("select c from Course c where c.id = :courseId")
    Optional<Course> findByIdWithLessons(Long courseId);
}
