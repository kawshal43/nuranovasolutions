package com.nuranova.education.service;

import com.nuranova.education.model.AccessLevel;
import com.nuranova.education.model.Course;
import com.nuranova.education.model.Lesson;
import com.nuranova.education.model.LessonAccessGrant;
import com.nuranova.education.model.LessonProgress;
import com.nuranova.education.model.Role;
import com.nuranova.education.model.UserAccount;
import com.nuranova.education.repo.CourseRepository;
import com.nuranova.education.repo.LessonAccessGrantRepository;
import com.nuranova.education.repo.LessonProgressRepository;
import com.nuranova.education.repo.LessonRepository;
import com.nuranova.education.web.ApiDtos.CourseDetailResponse;
import com.nuranova.education.web.ApiDtos.CourseSummaryResponse;
import com.nuranova.education.web.ApiDtos.LessonResponse;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final LessonAccessGrantRepository lessonAccessGrantRepository;
    private final MediaStorageService mediaStorageService;
    private final MediaTokenService mediaTokenService;

    public CourseService(
            CourseRepository courseRepository,
            LessonRepository lessonRepository,
            LessonProgressRepository lessonProgressRepository,
            LessonAccessGrantRepository lessonAccessGrantRepository,
            MediaStorageService mediaStorageService,
            MediaTokenService mediaTokenService
    ) {
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.lessonProgressRepository = lessonProgressRepository;
        this.lessonAccessGrantRepository = lessonAccessGrantRepository;
        this.mediaStorageService = mediaStorageService;
        this.mediaTokenService = mediaTokenService;
    }

    @Transactional(readOnly = true)
    public List<CourseSummaryResponse> getPublicCourses() {
        return courseRepository.findAllByPublishedTrueOrderBySortOrderAsc().stream()
                .map(this::toPublicSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CourseSummaryResponse> getUserCourses(UserAccount user) {
        return courseRepository.findAllByPublishedTrueOrderBySortOrderAsc().stream()
                .map(course -> toUserSummary(course, user))
                .toList();
    }

    @Transactional(readOnly = true)
    public CourseDetailResponse getPublicCourseDetail(String slug) {
        Course course = getCourseBySlug(slug);
        List<Lesson> publishedLessons = getPublishedLessons(course);

        List<LessonResponse> lessons = publishedLessons.stream()
                .map(lesson -> new LessonResponse(
                        lesson.getId(),
                        lesson.getTitle(),
                        lesson.getDescription(),
                        lesson.getDurationLabel(),
                        lesson.getAccessLevel(),
                        false,
                        false,
                        false,
                        null,
                        null,
                        null
                ))
                .toList();

        return new CourseDetailResponse(
                course.getId(),
                course.getSlug(),
                course.getTitle(),
                course.getDescription(),
                course.getCategory(),
                course.getIconUrl(),
                course.getProgressPercent() == null ? 0 : course.getProgressPercent(),
                lessons
        );
    }

    @Transactional(readOnly = true)
    public CourseDetailResponse getCourseDetailForUser(String slug, UserAccount user) {
        Course course = getCourseBySlug(slug);
        List<Lesson> publishedLessons = getPublishedLessons(course);
        List<LessonProgress> progressEntries = lessonProgressRepository.findAllByUserIdAndLessonCourseId(user.getId(), course.getId());
        Set<Long> completedLessonIds = progressEntries.stream()
                .filter(LessonProgress::isCompleted)
                .map(progress -> progress.getLesson().getId())
                .collect(Collectors.toSet());

        List<LessonResponse> lessons = new ArrayList<>();
        for (Lesson lesson : publishedLessons) {
            boolean accessible = canAccessLesson(user, lesson);
            boolean completed = completedLessonIds.contains(lesson.getId());
            String videoProvider = null;
            String videoSourceId = null;
            String videoPlaybackUrl = null;
            boolean videoReady = false;

            if (accessible) {
                if (lesson.getVideoSourceId() != null && !lesson.getVideoSourceId().isBlank()) {
                    videoProvider = "YOUTUBE";
                    videoSourceId = lesson.getVideoSourceId();
                    videoReady = true;
                } else if (mediaStorageService.hasStoredLessonVideo(lesson)) {
                    videoProvider = "UPLOAD";
                    videoPlaybackUrl = buildPlaybackUrl(user, lesson);
                    videoReady = true;
                }
            }

            lessons.add(new LessonResponse(
                    lesson.getId(),
                    lesson.getTitle(),
                    lesson.getDescription(),
                    lesson.getDurationLabel(),
                    lesson.getAccessLevel(),
                    accessible,
                    completed,
                    videoReady,
                    videoProvider,
                    videoSourceId,
                    videoPlaybackUrl
            ));
        }

        return new CourseDetailResponse(
                course.getId(),
                course.getSlug(),
                course.getTitle(),
                course.getDescription(),
                course.getCategory(),
                course.getIconUrl(),
                calculateProgressPercent(publishedLessons, completedLessonIds),
                lessons
        );
    }

    public void markLessonCompleted(String slug, Long lessonId, UserAccount user) {
        Course course = getCourseBySlug(slug);
        Lesson lesson = lessonRepository.findByIdAndCourseId(lessonId, course.getId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Lesson not found"));

        if (!canAccessLesson(user, lesson)) {
            throw new ResponseStatusException(FORBIDDEN, "You do not have access to this lesson");
        }

        LessonProgress progress = lessonProgressRepository.findByUserIdAndLessonId(user.getId(), lessonId)
                .orElseGet(() -> LessonProgress.builder()
                        .user(user)
                        .lesson(lesson)
                        .completed(false)
                        .build());

        progress.setCompleted(true);
        progress.setCompletedAt(Instant.now());
        lessonProgressRepository.save(progress);
    }

    public boolean canAccessLesson(UserAccount user, Lesson lesson) {
        if (user.getRole() == Role.ADMIN) {
            return true;
        }

        if (lesson.getAccessLevel() == AccessLevel.FREE) {
            return true;
        }

        if (lesson.getAccessLevel() == AccessLevel.PREMIUM) {
            return user.getRole() == Role.PREMIUM;
        }

        Optional<LessonAccessGrant> grant = lessonAccessGrantRepository.findByUserIdAndLessonId(user.getId(), lesson.getId());
        return grant.map(LessonAccessGrant::isAllowed).orElse(false);
    }

    public String extractVideoSourceId(String url) {
        if (url == null || url.isBlank()) {
            return null;
        }

        String trimmed = url.trim();
        if (trimmed.matches("[A-Za-z0-9_-]{11}")) {
            return trimmed;
        }

        try {
            URI uri = trimmed.contains("://") ? new URI(trimmed) : new URI("https://" + trimmed);
            String host = uri.getHost();
            if (host == null) {
                return null;
            }

            String normalizedHost = host.toLowerCase();
            String path = uri.getPath() == null ? "" : uri.getPath();
            String[] segments = path.split("/");

            if (normalizedHost.contains("youtu.be")) {
                return normalizeVideoId(segments.length > 1 ? segments[1] : null);
            }

            if (normalizedHost.contains("youtube.com") || normalizedHost.contains("youtube-nocookie.com")) {
                String queryVideoId = extractQueryParam(uri.getQuery(), "v");
                if (queryVideoId != null) {
                    return normalizeVideoId(queryVideoId);
                }

                for (int index = 0; index < segments.length - 1; index += 1) {
                    String segment = segments[index];
                    if ("embed".equals(segment) || "shorts".equals(segment) || "live".equals(segment) || "v".equals(segment)) {
                        return normalizeVideoId(segments[index + 1]);
                    }
                }
            }
        } catch (URISyntaxException ignored) {
            return null;
        }

        return null;
    }

    private String buildPlaybackUrl(UserAccount user, Lesson lesson) {
        String token = mediaTokenService.generateLessonPlaybackToken(user, lesson);
        return "/api/media/lessons/" + lesson.getId() + "/stream?token=" + token;
    }

    private String extractQueryParam(String query, String key) {
        if (query == null || query.isBlank()) {
            return null;
        }

        for (String pair : query.split("&")) {
            String[] parts = pair.split("=", 2);
            if (parts.length == 2 && key.equals(parts[0])) {
                return parts[1];
            }
        }

        return null;
    }

    private String normalizeVideoId(String candidate) {
        if (candidate == null || candidate.isBlank()) {
            return null;
        }

        String sanitized = candidate.trim();
        int delimiterIndex = sanitized.indexOf('?');
        if (delimiterIndex >= 0) {
            sanitized = sanitized.substring(0, delimiterIndex);
        }

        delimiterIndex = sanitized.indexOf('&');
        if (delimiterIndex >= 0) {
            sanitized = sanitized.substring(0, delimiterIndex);
        }

        return sanitized.matches("[A-Za-z0-9_-]{11}") ? sanitized : null;
    }

    private CourseSummaryResponse toPublicSummary(Course course) {
        List<Lesson> publishedLessons = getPublishedLessons(course);
        long lockedLessons = publishedLessons.stream()
                .filter(lesson -> lesson.getAccessLevel() != AccessLevel.FREE)
                .count();

        return new CourseSummaryResponse(
                course.getId(),
                course.getSlug(),
                course.getTitle(),
                course.getShortDescription(),
                course.getCategory(),
                course.getIconUrl(),
                course.getProgressPercent() == null ? 0 : course.getProgressPercent(),
                publishedLessons.size(),
                lockedLessons
        );
    }

    private CourseSummaryResponse toUserSummary(Course course, UserAccount user) {
        List<Lesson> publishedLessons = getPublishedLessons(course);
        Set<Long> completedLessonIds = lessonProgressRepository.findAllByUserIdAndLessonCourseId(user.getId(), course.getId()).stream()
                .filter(LessonProgress::isCompleted)
                .map(progress -> progress.getLesson().getId())
                .collect(Collectors.toSet());
        long lockedLessons = publishedLessons.stream()
                .filter(lesson -> !canAccessLesson(user, lesson))
                .count();

        return new CourseSummaryResponse(
                course.getId(),
                course.getSlug(),
                course.getTitle(),
                course.getShortDescription(),
                course.getCategory(),
                course.getIconUrl(),
                calculateProgressPercent(publishedLessons, completedLessonIds),
                publishedLessons.size(),
                lockedLessons
        );
    }

    private List<Lesson> getPublishedLessons(Course course) {
        return course.getLessons().stream()
                .filter(Lesson::isPublished)
                .sorted(Comparator.comparing(Lesson::getSortOrder))
                .toList();
    }

    private int calculateProgressPercent(List<Lesson> lessons, Set<Long> completedLessonIds) {
        if (lessons.isEmpty()) {
            return 0;
        }

        long completedCount = lessons.stream()
                .filter(lesson -> completedLessonIds.contains(lesson.getId()))
                .count();

        return (int) Math.round((completedCount * 100.0) / lessons.size());
    }

    private Course getCourseBySlug(String slug) {
        Course course = courseRepository.findBySlugWithLessons(slug)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Course not found"));

        if (!course.isPublished()) {
            throw new ResponseStatusException(NOT_FOUND, "Course not found");
        }

        return course;
    }
}
