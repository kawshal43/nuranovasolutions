package com.nuranova.education.web;

import com.nuranova.education.service.AuthService;
import com.nuranova.education.service.CourseService;
import com.nuranova.education.web.ApiDtos.CourseDetailResponse;
import com.nuranova.education.web.ApiDtos.CourseSummaryResponse;
import com.nuranova.education.web.ApiDtos.MessageResponse;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;
    private final AuthService authService;

    public CourseController(CourseService courseService, AuthService authService) {
        this.courseService = courseService;
        this.authService = authService;
    }

    @GetMapping("/public")
    public List<CourseSummaryResponse> publicCourses() {
        return courseService.getPublicCourses();
    }

    @GetMapping
    public List<CourseSummaryResponse> courses(Authentication authentication) {
        return courseService.getUserCourses(authService.getRequiredUser(authentication.getName()));
    }

    @GetMapping("/public/{slug}")
    public CourseDetailResponse publicCourse(@PathVariable String slug) {
        return courseService.getPublicCourseDetail(slug);
    }

    @GetMapping("/{slug}")
    public CourseDetailResponse courseDetail(@PathVariable String slug, Authentication authentication) {
        return courseService.getCourseDetailForUser(slug, authService.getRequiredUser(authentication.getName()));
    }

    @PostMapping("/{slug}/lessons/{lessonId}/complete")
    public MessageResponse markCompleted(
            @PathVariable String slug,
            @PathVariable Long lessonId,
            Authentication authentication
    ) {
        courseService.markLessonCompleted(slug, lessonId, authService.getRequiredUser(authentication.getName()));
        return new MessageResponse("Lesson marked as completed");
    }
}
