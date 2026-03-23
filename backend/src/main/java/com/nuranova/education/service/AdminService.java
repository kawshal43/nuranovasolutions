package com.nuranova.education.service;

import com.nuranova.education.model.AccessLevel;
import com.nuranova.education.model.Course;
import com.nuranova.education.model.Lesson;
import com.nuranova.education.model.LessonAccessGrant;
import com.nuranova.education.model.Role;
import com.nuranova.education.model.UserAccount;
import com.nuranova.education.repo.CourseRepository;
import com.nuranova.education.repo.LessonAccessGrantRepository;
import com.nuranova.education.repo.LessonProgressRepository;
import com.nuranova.education.repo.LessonRepository;
import com.nuranova.education.repo.UserAccountRepository;
import com.nuranova.education.web.ApiDtos.AdminAccessRequest;
import com.nuranova.education.web.ApiDtos.AdminCourseResponse;
import com.nuranova.education.web.ApiDtos.AdminCourseRequest;
import com.nuranova.education.web.ApiDtos.AdminDashboardResponse;
import com.nuranova.education.web.ApiDtos.AdminLessonRequest;
import com.nuranova.education.web.ApiDtos.AdminLessonResponse;
import com.nuranova.education.web.ApiDtos.AdminUserResponse;
import com.nuranova.education.web.ApiDtos.AdminUserRoleRequest;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@Transactional
public class AdminService {

    private final UserAccountRepository userAccountRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final LessonAccessGrantRepository lessonAccessGrantRepository;
    private final CourseService courseService;
    private final MediaStorageService mediaStorageService;

    public AdminService(
            UserAccountRepository userAccountRepository,
            CourseRepository courseRepository,
            LessonRepository lessonRepository,
            LessonProgressRepository lessonProgressRepository,
            LessonAccessGrantRepository lessonAccessGrantRepository,
            CourseService courseService,
            MediaStorageService mediaStorageService
    ) {
        this.userAccountRepository = userAccountRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.lessonProgressRepository = lessonProgressRepository;
        this.lessonAccessGrantRepository = lessonAccessGrantRepository;
        this.courseService = courseService;
        this.mediaStorageService = mediaStorageService;
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        return new AdminDashboardResponse(
                userAccountRepository.count(),
                courseRepository.count(),
                lessonRepository.count(),
                lessonProgressRepository.count()
        );
    }

    @Transactional(readOnly = true)
    public List<AdminUserResponse> listUsers() {
        return userAccountRepository.findAll().stream()
                .map(user -> new AdminUserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getFullName(),
                        user.getAvatarUrl(),
                        user.getRole(),
                        user.getProvider(),
                        user.getCreatedAt()
                ))
                .toList();
    }

    public AdminUserResponse updateUserRole(Long userId, AdminUserRoleRequest request) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        user.setRole(request.role());
        UserAccount savedUser = userAccountRepository.save(user);

        return new AdminUserResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getAvatarUrl(),
                savedUser.getRole(),
                savedUser.getProvider(),
                savedUser.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<AdminCourseResponse> listCourses() {
        return courseRepository.findAllByOrderBySortOrderAsc().stream()
                .map(this::toCourseResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminCourseResponse getCourse(Long courseId) {
        Course course = courseRepository.findByIdWithLessons(courseId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Course not found"));
        return toCourseResponse(course);
    }

    @Transactional(readOnly = true)
    public List<AdminLessonResponse> listLessons(Long courseId) {
        courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Course not found"));

        return lessonRepository.findAllByCourseIdOrderBySortOrderAsc(courseId).stream()
                .map(this::toLessonResponse)
                .toList();
    }

    public AdminCourseResponse createCourse(AdminCourseRequest request) {
        ensureSlugAvailable(request.slug(), null);

        Course course = Course.builder()
                .slug(request.slug())
                .title(request.title())
                .shortDescription(request.shortDescription())
                .description(request.description())
                .category(request.category())
                .iconUrl(request.iconUrl())
                .progressPercent(request.progressPercent())
                .sortOrder(request.sortOrder() == null ? 0 : request.sortOrder())
                .published(request.published())
                .build();

        return toCourseResponse(courseRepository.save(course));
    }

    public AdminCourseResponse updateCourse(Long courseId, AdminCourseRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Course not found"));
        ensureSlugAvailable(request.slug(), courseId);

        course.setSlug(request.slug());
        course.setTitle(request.title());
        course.setShortDescription(request.shortDescription());
        course.setDescription(request.description());
        course.setCategory(request.category());
        course.setIconUrl(request.iconUrl());
        course.setProgressPercent(request.progressPercent());
        course.setSortOrder(request.sortOrder() == null ? 0 : request.sortOrder());
        course.setPublished(request.published());

        return toCourseResponse(courseRepository.save(course));
    }

    public void deleteCourse(Long courseId) {
        Course course = courseRepository.findByIdWithLessons(courseId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Course not found"));

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

        course.getLessons().forEach(mediaStorageService::deleteLessonVideo);
        courseRepository.delete(course);
    }

    public AdminLessonResponse createLesson(AdminLessonRequest request) {
        Course course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Course not found"));
        String normalizedVideoUrl = normalizeVideoUrl(request.videoUrl());
        String videoSourceId = resolveVideoSourceId(normalizedVideoUrl);

        Lesson lesson = Lesson.builder()
                .course(course)
                .title(request.title())
                .description(request.description())
                .videoUrl(normalizedVideoUrl)
                .videoSourceId(videoSourceId)
                .durationLabel(request.durationLabel())
                .accessLevel(request.accessLevel())
                .sortOrder(request.sortOrder() == null ? 0 : request.sortOrder())
                .published(request.published())
                .build();

        return toLessonResponse(lessonRepository.save(lesson));
    }

    public AdminLessonResponse updateLesson(Long lessonId, AdminLessonRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Lesson not found"));
        Course course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Course not found"));
        String normalizedVideoUrl = normalizeVideoUrl(request.videoUrl());
        String videoSourceId = resolveVideoSourceId(normalizedVideoUrl);

        lesson.setCourse(course);
        lesson.setTitle(request.title());
        lesson.setDescription(request.description());
        lesson.setVideoUrl(normalizedVideoUrl);
        lesson.setVideoSourceId(videoSourceId);
        lesson.setDurationLabel(request.durationLabel());
        lesson.setAccessLevel(request.accessLevel());
        lesson.setSortOrder(request.sortOrder() == null ? 0 : request.sortOrder());
        lesson.setPublished(request.published());

        return toLessonResponse(lessonRepository.save(lesson));
    }

    public void deleteLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Lesson not found"));

        lessonAccessGrantRepository.deleteAll(
                lessonAccessGrantRepository.findAll().stream()
                        .filter(grant -> lessonId.equals(grant.getLesson().getId()))
                        .toList()
        );

        lessonProgressRepository.deleteAll(
                lessonProgressRepository.findAll().stream()
                        .filter(progress -> lessonId.equals(progress.getLesson().getId()))
                        .toList()
        );

        mediaStorageService.deleteLessonVideo(lesson);
        lessonRepository.delete(lesson);
    }

    public AdminLessonResponse uploadLessonVideo(Long lessonId, MultipartFile file) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Lesson not found"));

        mediaStorageService.storeLessonVideo(file, lesson);
        return toLessonResponse(lessonRepository.save(lesson));
    }

    public void updateCustomAccess(AdminAccessRequest request) {
        UserAccount user = userAccountRepository.findById(request.userId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        Lesson lesson = lessonRepository.findById(request.lessonId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Lesson not found"));

        LessonAccessGrant grant = lessonAccessGrantRepository.findByUserIdAndLessonId(user.getId(), lesson.getId())
                .orElse(LessonAccessGrant.builder()
                        .user(user)
                        .lesson(lesson)
                        .allowed(request.allowed())
                        .build());

        grant.setAllowed(request.allowed());
        lessonAccessGrantRepository.save(grant);
    }

    private void ensureSlugAvailable(String slug, Long ignoreCourseId) {
        courseRepository.findBySlug(slug)
                .filter(existing -> ignoreCourseId == null || !existing.getId().equals(ignoreCourseId))
                .ifPresent(existing -> {
                    throw new ResponseStatusException(BAD_REQUEST, "Course slug is already in use");
                });
    }

    private AdminCourseResponse toCourseResponse(Course course) {
        return new AdminCourseResponse(
                course.getId(),
                course.getSlug(),
                course.getTitle(),
                course.getShortDescription(),
                course.getDescription(),
                course.getCategory(),
                course.getIconUrl(),
                course.getProgressPercent(),
                course.getSortOrder(),
                course.isPublished(),
                course.getLessons().size()
        );
    }

    private AdminLessonResponse toLessonResponse(Lesson lesson) {
        return new AdminLessonResponse(
                lesson.getId(),
                lesson.getCourse().getId(),
                lesson.getTitle(),
                lesson.getDescription(),
                lesson.getVideoUrl(),
                lesson.getDurationLabel(),
                lesson.getAccessLevel(),
                lesson.getSortOrder(),
                lesson.isPublished(),
                mediaStorageService.hasStoredLessonVideo(lesson),
                lesson.getVideoOriginalFilename()
        );
    }

    private String normalizeVideoUrl(String videoUrl) {
        return videoUrl == null ? "" : videoUrl.trim();
    }

    private String resolveVideoSourceId(String normalizedVideoUrl) {
        if (normalizedVideoUrl.isBlank()) {
            return null;
        }

        String videoSourceId = courseService.extractVideoSourceId(normalizedVideoUrl);
        if (videoSourceId == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Enter a valid YouTube video link or video ID");
        }

        return videoSourceId;
    }
}
