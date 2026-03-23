package com.nuranova.education;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nuranova.education.model.Course;
import com.nuranova.education.model.Lesson;
import com.nuranova.education.model.UserAccount;
import com.nuranova.education.repo.CourseRepository;
import com.nuranova.education.repo.LessonAccessGrantRepository;
import com.nuranova.education.repo.LessonProgressRepository;
import com.nuranova.education.repo.LessonRepository;
import com.nuranova.education.repo.UserAccountRepository;
import jakarta.servlet.http.Cookie;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class BackendApplicationTests {

    private static final List<String> TEST_COURSE_PREFIXES = List.of("db-course-", "tracked-course-");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private LessonProgressRepository lessonProgressRepository;

    @Autowired
    private LessonAccessGrantRepository lessonAccessGrantRepository;

    @BeforeEach
    @AfterEach
    void cleanupTestArtifacts() {
        List<UserAccount> testUsers = userAccountRepository.findAll().stream()
                .filter(user -> user.getUsername() != null && user.getUsername().startsWith("learner"))
                .filter(user -> user.getEmail() != null && user.getEmail().endsWith("@example.com"))
                .toList();

        List<Course> testCourses = courseRepository.findAllByOrderBySortOrderAsc().stream()
                .filter(course -> TEST_COURSE_PREFIXES.stream().anyMatch(prefix -> course.getSlug().startsWith(prefix)))
                .toList();

        Set<Long> userIds = testUsers.stream()
                .map(UserAccount::getId)
                .collect(Collectors.toSet());

        Set<Long> lessonIds = testCourses.stream()
                .flatMap(course -> lessonRepository.findAllByCourseIdOrderBySortOrderAsc(course.getId()).stream())
                .map(Lesson::getId)
                .collect(Collectors.toSet());

        lessonAccessGrantRepository.deleteAll(
                lessonAccessGrantRepository.findAll().stream()
                        .filter(grant -> userIds.contains(grant.getUser().getId()) || lessonIds.contains(grant.getLesson().getId()))
                        .toList()
        );

        lessonProgressRepository.deleteAll(
                lessonProgressRepository.findAll().stream()
                        .filter(progress -> userIds.contains(progress.getUser().getId()) || lessonIds.contains(progress.getLesson().getId()))
                        .toList()
        );

        testCourses.forEach(courseRepository::delete);
        testUsers.forEach(userAccountRepository::delete);
    }

    @Test
    void seededAdminCanLoginAndReachDashboard() throws Exception {
        Cookie sessionCookie = loginAsAdmin();

        mockMvc.perform(get("/api/admin/dashboard").cookie(sessionCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers").isNumber())
                .andExpect(jsonPath("$.totalCourses").isNumber());
    }

    @Test
    void adminCreatedCourseAppearsInPublicCatalog() throws Exception {
        Cookie adminCookie = loginAsAdmin();
        String slug = "db-course-" + System.currentTimeMillis();

        createCourseWithLesson(adminCookie, slug);

        MvcResult publicCourses = mockMvc.perform(get("/api/courses/public"))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode courseList = objectMapper.readTree(publicCourses.getResponse().getContentAsString());
        boolean foundCourse = false;
        for (JsonNode course : courseList) {
            if (slug.equals(course.path("slug").asText())) {
                foundCourse = true;
                break;
            }
        }

        assertThat(foundCourse).isTrue();
    }

    @Test
    void registeredUserCanAccessAdminCreatedCourseAndTrackProgress() throws Exception {
        Cookie adminCookie = loginAsAdmin();
        String slug = "tracked-course-" + System.currentTimeMillis();
        createCourseWithLesson(adminCookie, slug);

        String username = "learner" + System.currentTimeMillis();
        String email = username + "@example.com";

        MvcResult registerResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "username", username,
                                "email", email,
                                "fullName", "Test Learner",
                                "password", "Nuranova99"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.role").value("USER"))
                .andReturn();

        Cookie sessionCookie = extractSessionCookie(registerResult);
        assertThat(sessionCookie).isNotNull();

        MvcResult courseResult = mockMvc.perform(get("/api/courses/{slug}", slug).cookie(sessionCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value(slug))
                .andExpect(jsonPath("$.lessons[0].accessible").value(true))
                .andExpect(jsonPath("$.lessons[0].videoReady").value(true))
                .andExpect(jsonPath("$.lessons[0].videoPlaybackUrl").isString())
                .andReturn();

        JsonNode coursePayload = objectMapper.readTree(courseResult.getResponse().getContentAsString());
        long lessonId = coursePayload.path("lessons").get(0).path("id").asLong();
        String playbackUrl = coursePayload.path("lessons").get(0).path("videoPlaybackUrl").asText();

        URI playbackUri = URI.create("http://localhost" + playbackUrl);
        mockMvc.perform(get(playbackUri.getRawPath() + "?" + playbackUri.getRawQuery()).cookie(sessionCookie))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/courses/{slug}/lessons/{lessonId}/complete", slug, lessonId)
                        .cookie(sessionCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Lesson marked as completed"));

        mockMvc.perform(get("/api/courses/{slug}", slug).cookie(sessionCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lessons[0].completed").value(true))
                .andExpect(jsonPath("$.progressPercent").isNumber());
    }

    @Test
    void registeredUserReceivesYoutubeProviderMetadataForYoutubeLessons() throws Exception {
        Cookie adminCookie = loginAsAdmin();
        String slug = "tracked-course-" + System.currentTimeMillis();
        createCourseWithYoutubeLesson(adminCookie, slug, "https://youtu.be/zGjZS5xnH1A");

        String username = "learner" + System.currentTimeMillis();
        String email = username + "@example.com";

        MvcResult registerResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "username", username,
                                "email", email,
                                "fullName", "YouTube Learner",
                                "password", "Nuranova99"
                        ))))
                .andExpect(status().isOk())
                .andReturn();

        Cookie sessionCookie = extractSessionCookie(registerResult);
        assertThat(sessionCookie).isNotNull();

        mockMvc.perform(get("/api/courses/{slug}", slug).cookie(sessionCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lessons[0].accessible").value(true))
                .andExpect(jsonPath("$.lessons[0].videoReady").value(true))
                .andExpect(jsonPath("$.lessons[0].videoProvider").value("YOUTUBE"))
                .andExpect(jsonPath("$.lessons[0].videoSourceId").value("zGjZS5xnH1A"));
    }

    private Cookie loginAsAdmin() throws Exception {
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "usernameOrEmail", "nuranova",
                                "password", "00000000"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.role").value("ADMIN"))
                .andReturn();

        Cookie sessionCookie = extractSessionCookie(loginResult);
        assertThat(sessionCookie).isNotNull();
        return sessionCookie;
    }

    private JsonNode createCourseWithLesson(Cookie adminCookie, String slug) throws Exception {
        MvcResult courseResult = mockMvc.perform(post("/api/admin/courses")
                        .cookie(adminCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "slug", slug,
                                "title", "Database Course " + slug,
                                "shortDescription", "Database-backed course created during integration testing.",
                                "description", "This record is created through the admin API to verify that frontend and backend content comes from MySQL.",
                                "category", "Testing",
                                "iconUrl", "/services/education.png",
                                "progressPercent", 0,
                                "sortOrder", 0,
                                "published", true
                        ))))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode coursePayload = objectMapper.readTree(courseResult.getResponse().getContentAsString());
        long courseId = coursePayload.path("id").asLong();

        MvcResult lessonResult = mockMvc.perform(post("/api/admin/lessons")
                        .cookie(adminCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "courseId", courseId,
                                "title", "Database Lesson",
                                "description", "Free lesson created during integration testing.",
                                "videoUrl", "",
                                "durationLabel", "10 min",
                                "accessLevel", "FREE",
                                "sortOrder", 0,
                                "published", true
                        ))))
                .andExpect(status().isOk())
                .andReturn();

        long lessonId = objectMapper.readTree(lessonResult.getResponse().getContentAsString()).path("id").asLong();
        MockMultipartFile videoFile = new MockMultipartFile(
                "file",
                "lesson.mp4",
                "video/mp4",
                "fake-secure-video".getBytes()
        );

        mockMvc.perform(multipart("/api/admin/lessons/{lessonId}/video", lessonId)
                        .file(videoFile)
                        .cookie(adminCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hasUploadedVideo").value(true));

        return coursePayload;
    }

    private JsonNode createCourseWithYoutubeLesson(Cookie adminCookie, String slug, String youtubeUrl) throws Exception {
        MvcResult courseResult = mockMvc.perform(post("/api/admin/courses")
                        .cookie(adminCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "slug", slug,
                                "title", "Database Course " + slug,
                                "shortDescription", "Database-backed course created during integration testing.",
                                "description", "This record is created through the admin API to verify YouTube-backed lesson metadata.",
                                "category", "Testing",
                                "iconUrl", "/services/education.png",
                                "progressPercent", 0,
                                "sortOrder", 0,
                                "published", true
                        ))))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode coursePayload = objectMapper.readTree(courseResult.getResponse().getContentAsString());
        long courseId = coursePayload.path("id").asLong();

        mockMvc.perform(post("/api/admin/lessons")
                        .cookie(adminCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "courseId", courseId,
                                "title", "YouTube Lesson",
                                "description", "Lesson backed by a YouTube link for custom-player delivery.",
                                "videoUrl", youtubeUrl,
                                "durationLabel", "10 min",
                                "accessLevel", "FREE",
                                "sortOrder", 0,
                                "published", true
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.videoUrl").value(youtubeUrl));

        return coursePayload;
    }

    private Cookie extractSessionCookie(MvcResult result) {
        String setCookie = result.getResponse().getHeader("Set-Cookie");
        assertThat(setCookie).isNotBlank();

        String token = setCookie.split(";", 2)[0].split("=", 2)[1];
        Cookie cookie = new Cookie("nuranova_session", token);
        cookie.setPath("/");
        return cookie;
    }
}
