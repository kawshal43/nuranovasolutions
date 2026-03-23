package com.nuranova.education.web;

import com.nuranova.education.model.AccessLevel;
import com.nuranova.education.model.AuthProvider;
import com.nuranova.education.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

public final class ApiDtos {

    private ApiDtos() {
    }

    public record RegisterRequest(
            @NotBlank(message = "Username is required")
            @Size(min = 3, max = 120, message = "Username must be between 3 and 120 characters")
            String username,
            @NotBlank(message = "Email is required")
            @Email(message = "Enter a valid email address")
            @Size(max = 180, message = "Email must be 180 characters or less")
            String email,
            @NotBlank(message = "Full name is required")
            @Size(min = 3, max = 180, message = "Full name must be between 3 and 180 characters")
            String fullName,
            @NotBlank(message = "Password is required")
            @Size(min = 8, max = 120, message = "Password must be between 8 and 120 characters")
            String password
    ) {
    }

    public record LoginRequest(
            @NotBlank(message = "Username or email is required") String usernameOrEmail,
            @NotBlank(message = "Password is required") String password
    ) {
    }

    public record AuthResponse(
            UserResponse user,
            String message
    ) {
    }

    public record UserResponse(
            Long id,
            String username,
            String email,
            String fullName,
            String bio,
            String avatarUrl,
            Role role,
            AuthProvider provider
    ) {
    }

    public record ProfileUpdateRequest(
            @NotBlank(message = "Username is required")
            @Size(min = 3, max = 120, message = "Username must be between 3 and 120 characters")
            String username,
            @NotBlank(message = "Full name is required")
            @Size(min = 3, max = 180, message = "Full name must be between 3 and 180 characters")
            String fullName,
            @NotBlank(message = "Email is required")
            @Email(message = "Enter a valid email address")
            @Size(max = 180, message = "Email must be 180 characters or less")
            String email,
            @Size(max = 1200, message = "Bio must be 1200 characters or less")
            String bio
    ) {
    }

    public record ChangePasswordRequest(
            @NotBlank(message = "Current password is required")
            String currentPassword,
            @NotBlank(message = "New password is required")
            @Size(min = 8, max = 120, message = "New password must be between 8 and 120 characters")
            String newPassword
    ) {
    }

    public record MessageResponse(String message) {
    }

    public record CourseSummaryResponse(
            Long id,
            String slug,
            String title,
            String shortDescription,
            String category,
            String iconUrl,
            Integer progressPercent,
            long totalLessons,
            long lockedLessons
    ) {
    }

    public record LessonResponse(
            Long id,
            String title,
            String description,
            String durationLabel,
            AccessLevel accessLevel,
            boolean accessible,
            boolean completed,
            boolean videoReady,
            String videoProvider,
            String videoSourceId,
            String videoPlaybackUrl
    ) {
    }

    public record CourseDetailResponse(
            Long id,
            String slug,
            String title,
            String description,
            String category,
            String iconUrl,
            Integer progressPercent,
            List<LessonResponse> lessons
    ) {
    }

    public record AdminCourseRequest(
            @NotBlank @Size(max = 180) String slug,
            @NotBlank @Size(max = 180) String title,
            @NotBlank @Size(max = 500) String shortDescription,
            @NotBlank @Size(max = 4000) String description,
            @NotBlank @Size(max = 120) String category,
            @Size(max = 500) String iconUrl,
            Integer progressPercent,
            Integer sortOrder,
            @NotNull Boolean published
    ) {
    }

    public record AdminLessonRequest(
            @NotNull Long courseId,
            @NotBlank @Size(max = 200) String title,
            @NotBlank @Size(max = 3000) String description,
            @Size(max = 500) String videoUrl,
            @Size(max = 50) String durationLabel,
            @NotNull AccessLevel accessLevel,
            Integer sortOrder,
            @NotNull Boolean published
    ) {
    }

    public record AdminLessonResponse(
            Long id,
            Long courseId,
            String title,
            String description,
            String videoUrl,
            String durationLabel,
            AccessLevel accessLevel,
            Integer sortOrder,
            Boolean published,
            boolean hasUploadedVideo,
            String videoOriginalFilename
    ) {
    }

    public record AdminCourseResponse(
            Long id,
            String slug,
            String title,
            String shortDescription,
            String description,
            String category,
            String iconUrl,
            Integer progressPercent,
            Integer sortOrder,
            Boolean published,
            long totalLessons
    ) {
    }

    public record AdminUserRoleRequest(@NotNull Role role) {
    }

    public record AdminAccessRequest(
            @NotNull Long userId,
            @NotNull Long lessonId,
            @NotNull Boolean allowed
    ) {
    }

    public record AdminDashboardResponse(
            long totalUsers,
            long totalCourses,
            long totalLessons,
            long totalProgressRecords
    ) {
    }

    public record AdminUserResponse(
            Long id,
            String username,
            String email,
            String fullName,
            String avatarUrl,
            Role role,
            AuthProvider provider,
            Instant createdAt
    ) {
    }
}
