package com.nuranova.education.web;

import com.nuranova.education.service.AdminService;
import com.nuranova.education.web.ApiDtos.AdminAccessRequest;
import com.nuranova.education.web.ApiDtos.AdminCourseResponse;
import com.nuranova.education.web.ApiDtos.AdminCourseRequest;
import com.nuranova.education.web.ApiDtos.AdminDashboardResponse;
import com.nuranova.education.web.ApiDtos.AdminLessonRequest;
import com.nuranova.education.web.ApiDtos.AdminLessonResponse;
import com.nuranova.education.web.ApiDtos.AdminUserResponse;
import com.nuranova.education.web.ApiDtos.AdminUserRoleRequest;
import com.nuranova.education.web.ApiDtos.MessageResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardResponse dashboard() {
        return adminService.getDashboard();
    }

    @GetMapping("/users")
    public List<AdminUserResponse> users() {
        return adminService.listUsers();
    }

    @PutMapping("/users/{userId}/role")
    public AdminUserResponse updateUserRole(
            @PathVariable Long userId,
            @Valid @RequestBody AdminUserRoleRequest request
    ) {
        return adminService.updateUserRole(userId, request);
    }

    @GetMapping("/courses")
    public List<AdminCourseResponse> courses() {
        return adminService.listCourses();
    }

    @GetMapping("/courses/{courseId}")
    public AdminCourseResponse course(@PathVariable Long courseId) {
        return adminService.getCourse(courseId);
    }

    @PostMapping("/courses")
    public AdminCourseResponse createCourse(@Valid @RequestBody AdminCourseRequest request) {
        return adminService.createCourse(request);
    }

    @PutMapping("/courses/{courseId}")
    public AdminCourseResponse updateCourse(
            @PathVariable Long courseId,
            @Valid @RequestBody AdminCourseRequest request
    ) {
        return adminService.updateCourse(courseId, request);
    }

    @DeleteMapping("/courses/{courseId}")
    public MessageResponse deleteCourse(@PathVariable Long courseId) {
        adminService.deleteCourse(courseId);
        return new MessageResponse("Course deleted");
    }

    @GetMapping("/courses/{courseId}/lessons")
    public List<AdminLessonResponse> lessons(@PathVariable Long courseId) {
        return adminService.listLessons(courseId);
    }

    @PostMapping("/lessons")
    public AdminLessonResponse createLesson(@Valid @RequestBody AdminLessonRequest request) {
        return adminService.createLesson(request);
    }

    @PutMapping("/lessons/{lessonId}")
    public AdminLessonResponse updateLesson(
            @PathVariable Long lessonId,
            @Valid @RequestBody AdminLessonRequest request
    ) {
        return adminService.updateLesson(lessonId, request);
    }

    @DeleteMapping("/lessons/{lessonId}")
    public MessageResponse deleteLesson(@PathVariable Long lessonId) {
        adminService.deleteLesson(lessonId);
        return new MessageResponse("Lesson deleted");
    }

    @PostMapping(value = "/lessons/{lessonId}/video", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AdminLessonResponse uploadLessonVideo(
            @PathVariable Long lessonId,
            @RequestParam("file") MultipartFile file
    ) {
        return adminService.uploadLessonVideo(lessonId, file);
    }

    @PostMapping("/access-grants")
    public MessageResponse updateAccess(@Valid @RequestBody AdminAccessRequest request) {
        adminService.updateCustomAccess(request);
        return new MessageResponse("Custom access updated");
    }
}
