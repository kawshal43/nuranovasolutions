package com.nuranova.education.web;

import com.nuranova.education.model.Lesson;
import com.nuranova.education.model.UserAccount;
import com.nuranova.education.repo.LessonRepository;
import com.nuranova.education.service.AuthService;
import com.nuranova.education.service.CourseService;
import com.nuranova.education.service.MediaStorageService;
import com.nuranova.education.service.MediaTokenService;
import java.io.IOException;
import java.util.List;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRange;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    private static final long CHUNK_SIZE = 1024 * 1024;

    private final AuthService authService;
    private final CourseService courseService;
    private final LessonRepository lessonRepository;
    private final MediaStorageService mediaStorageService;
    private final MediaTokenService mediaTokenService;

    public MediaController(
            AuthService authService,
            CourseService courseService,
            LessonRepository lessonRepository,
            MediaStorageService mediaStorageService,
            MediaTokenService mediaTokenService
    ) {
        this.authService = authService;
        this.courseService = courseService;
        this.lessonRepository = lessonRepository;
        this.mediaStorageService = mediaStorageService;
        this.mediaTokenService = mediaTokenService;
    }

    @GetMapping("/avatars/{filename:.+}")
    public ResponseEntity<Resource> avatar(@PathVariable String filename) {
        Resource resource = mediaStorageService.loadAvatar(filename);
        return ResponseEntity.ok()
                .contentType(MediaTypeFactory.getMediaType(resource).orElse(MediaType.IMAGE_JPEG))
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                .body(resource);
    }

    @GetMapping("/avatar-users/{userId}")
    public ResponseEntity<ByteArrayResource> avatarForUser(@PathVariable Long userId) {
        UserAccount user = authService.getRequiredUserById(userId);
        if (user.getAvatarData() == null || user.getAvatarData().length == 0) {
            throw new ResponseStatusException(NOT_FOUND, "Avatar not found");
        }

        return ResponseEntity.ok()
                .contentType(resolveMediaType(user.getAvatarContentType(), MediaType.IMAGE_JPEG))
                .header(HttpHeaders.CACHE_CONTROL, "private, max-age=3600")
                .body(new ByteArrayResource(user.getAvatarData()));
    }

    @GetMapping("/lessons/{lessonId}/stream")
    public ResponseEntity<?> streamLessonVideo(
            @PathVariable Long lessonId,
            @RequestParam String token,
            @RequestHeader HttpHeaders headers,
            Authentication authentication
    ) {
        UserAccount user = authService.getRequiredUser(authentication.getName());
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Lesson not found"));

        if (!courseService.canAccessLesson(user, lesson)) {
            throw new ResponseStatusException(FORBIDDEN, "You do not have access to this lesson");
        }

        if (!mediaTokenService.isLessonPlaybackTokenValid(token, user, lesson)) {
            throw new ResponseStatusException(FORBIDDEN, "Playback token is invalid or expired");
        }

        Resource resource = mediaStorageService.loadLessonVideo(lesson);
        MediaType mediaType = resolveMediaType(mediaStorageService.getLessonVideoMimeType(lesson), MediaType.APPLICATION_OCTET_STREAM);
        long contentLength = contentLength(resource);
        List<HttpRange> ranges = headers.getRange();

        if (ranges.isEmpty()) {
            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .contentLength(contentLength)
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .header(HttpHeaders.CACHE_CONTROL, "no-store, no-cache, must-revalidate")
                    .body(resource);
        }

        HttpRange range = ranges.get(0);
        long start = range.getRangeStart(contentLength);
        long end = Math.min(range.getRangeEnd(contentLength), start + CHUNK_SIZE - 1);
        ResourceRegion region = new ResourceRegion(resource, start, end - start + 1);
        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                .contentType(mediaType)
                .contentLength(region.getCount())
                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                .header(HttpHeaders.CACHE_CONTROL, "no-store, no-cache, must-revalidate")
                .body(region);
    }

    private long contentLength(Resource resource) {
        try {
            return resource.contentLength();
        } catch (IOException exception) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Unable to read stored media");
        }
    }

    private MediaType resolveMediaType(String raw, MediaType fallback) {
        try {
            return MediaType.parseMediaType(raw);
        } catch (Exception exception) {
            return fallback;
        }
    }
}
