package com.nuranova.education.config;

import com.nuranova.education.model.Course;
import com.nuranova.education.model.Lesson;
import com.nuranova.education.model.Role;
import com.nuranova.education.model.UserAccount;
import com.nuranova.education.repo.CourseRepository;
import com.nuranova.education.repo.LessonAccessGrantRepository;
import com.nuranova.education.repo.LessonProgressRepository;
import com.nuranova.education.repo.UserAccountRepository;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserAccountRepository userAccountRepository;
    private final CourseRepository courseRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final LessonAccessGrantRepository lessonAccessGrantRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            UserAccountRepository userAccountRepository,
            CourseRepository courseRepository,
            LessonProgressRepository lessonProgressRepository,
            LessonAccessGrantRepository lessonAccessGrantRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userAccountRepository = userAccountRepository;
        this.courseRepository = courseRepository;
        this.lessonProgressRepository = lessonProgressRepository;
        this.lessonAccessGrantRepository = lessonAccessGrantRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        removeLegacyDemoCourses();
        seedAdmin();
    }

    private void seedAdmin() {
        UserAccount admin = userAccountRepository.findByUsername("nuranova")
                .orElseGet(() -> UserAccount.builder().username("nuranova").build());

        admin.setEmail("admin@nuranova.com");
        admin.setFullName("NuraNova Admin");
        admin.setRole(Role.ADMIN);

        if (admin.getPasswordHash() == null || !passwordEncoder.matches("00000000", admin.getPasswordHash())) {
            admin.setPasswordHash(passwordEncoder.encode("00000000"));
        }

        userAccountRepository.save(admin);
    }

    private void removeLegacyDemoCourses() {
        removeLegacyDemoCourse(
                "python-fundamentals",
                "Python Fundamentals",
                "Learn Python foundations with guided beginner-friendly lessons."
        );
        removeLegacyDemoCourse(
                "web-ui-foundations",
                "Web UI Foundations",
                "Build clean interfaces with layout, spacing, and responsive structure."
        );
    }

    private void removeLegacyDemoCourse(String slug, String title, String shortDescription) {
        courseRepository.findBySlugWithLessons(slug)
                .filter(course -> title.equals(course.getTitle()))
                .filter(course -> shortDescription.equals(course.getShortDescription()))
                .ifPresent(this::deleteCourseWithRelatedRecords);
    }

    private void deleteCourseWithRelatedRecords(Course course) {
        Set<Long> lessonIds = course.getLessons().stream()
                .map(Lesson::getId)
                .collect(Collectors.toSet());

        lessonAccessGrantRepository.deleteAll(
                lessonAccessGrantRepository.findAll().stream()
                        .filter(grant -> lessonIds.contains(grant.getLesson().getId()))
                        .toList()
        );

        lessonProgressRepository.deleteAll(
                lessonProgressRepository.findAll().stream()
                        .filter(progress -> lessonIds.contains(progress.getLesson().getId()))
                        .toList()
        );

        courseRepository.delete(course);
    }
}
