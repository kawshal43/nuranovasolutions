package com.nuranova.education.service;

import com.nuranova.education.model.Lesson;
import com.nuranova.education.model.UserAccount;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class MediaStorageService {

    private static final Set<String> IMAGE_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/gif");
    private static final Set<String> VIDEO_TYPES = Set.of("video/mp4", "video/webm", "video/ogg", "video/quicktime");

    private final Path rootPath;
    private final Path avatarPath;
    private final Path lessonVideoPath;

    public MediaStorageService(@Value("${app.storage.root}") String rootLocation) {
        this.rootPath = Paths.get(rootLocation).toAbsolutePath().normalize();
        this.avatarPath = rootPath.resolve("avatars");
        this.lessonVideoPath = rootPath.resolve("lesson-videos");
    }

    @PostConstruct
    public void initialize() {
        try {
            Files.createDirectories(avatarPath);
            Files.createDirectories(lessonVideoPath);
        } catch (IOException exception) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Unable to initialize file storage");
        }
    }

    public String storeAvatar(MultipartFile file, UserAccount user) {
        validateImageFile(file);
        deleteAvatarByUrl(user.getAvatarUrl());

        String filename = buildStoredFilename("avatar-" + user.getId(), file.getOriginalFilename());
        copy(file, avatarPath.resolve(filename));
        return "/api/media/avatars/" + filename;
    }

    public void storeLessonVideo(MultipartFile file, Lesson lesson) {
        validateVideoFile(file);
        deleteLessonVideo(lesson);

        String filename = buildStoredFilename("lesson-" + lesson.getId(), file.getOriginalFilename());
        copy(file, lessonVideoPath.resolve(filename));

        lesson.setVideoStorageKey(filename);
        lesson.setVideoOriginalFilename(cleanOriginalFilename(file.getOriginalFilename()));
        lesson.setVideoMimeType(normalizeContentType(file.getContentType(), "video/mp4"));
        lesson.setVideoSourceId(null);
        lesson.setVideoUrl("");
    }

    public Resource loadAvatar(String filename) {
        return loadRequiredResource(avatarPath.resolve(cleanStorageFilename(filename)));
    }

    public Resource loadLessonVideo(Lesson lesson) {
        if (!hasStoredLessonVideo(lesson)) {
            throw new ResponseStatusException(NOT_FOUND, "Lesson video not found");
        }

        return loadRequiredResource(lessonVideoPath.resolve(cleanStorageFilename(lesson.getVideoStorageKey())));
    }

    public boolean hasStoredLessonVideo(Lesson lesson) {
        return lesson.getVideoStorageKey() != null && !lesson.getVideoStorageKey().isBlank();
    }

    public String getLessonVideoMimeType(Lesson lesson) {
        return normalizeContentType(lesson.getVideoMimeType(), "video/mp4");
    }

    public void deleteLessonVideo(Lesson lesson) {
        if (!hasStoredLessonVideo(lesson)) {
            return;
        }

        deleteIfExists(lessonVideoPath.resolve(cleanStorageFilename(lesson.getVideoStorageKey())));
        lesson.setVideoStorageKey(null);
        lesson.setVideoOriginalFilename(null);
        lesson.setVideoMimeType(null);
    }

    public void deleteAvatarByUrl(String avatarUrl) {
        if (avatarUrl == null || !avatarUrl.startsWith("/api/media/avatars/")) {
            return;
        }

        String filename = avatarUrl.substring("/api/media/avatars/".length());
        deleteIfExists(avatarPath.resolve(cleanStorageFilename(filename)));
    }

    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "Select an image to upload");
        }

        String contentType = normalizeContentType(file.getContentType(), "");
        if (!IMAGE_TYPES.contains(contentType)) {
            throw new ResponseStatusException(BAD_REQUEST, "Profile images must be JPG, PNG, WEBP, or GIF");
        }
    }

    private void validateVideoFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "Select a video file to upload");
        }

        String contentType = normalizeContentType(file.getContentType(), "");
        if (!VIDEO_TYPES.contains(contentType)) {
            throw new ResponseStatusException(BAD_REQUEST, "Lesson videos must be MP4, WEBM, OGG, or MOV");
        }
    }

    private Resource loadRequiredResource(Path path) {
        Resource resource = new FileSystemResource(path);
        if (!resource.exists() || !resource.isReadable()) {
            throw new ResponseStatusException(NOT_FOUND, "Requested file was not found");
        }
        return resource;
    }

    private void copy(MultipartFile file, Path target) {
        try (InputStream stream = file.getInputStream()) {
            Files.copy(stream, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException exception) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Unable to store uploaded file");
        }
    }

    private void deleteIfExists(Path path) {
        try {
            Files.deleteIfExists(path);
        } catch (IOException exception) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Unable to remove old stored file");
        }
    }

    private String buildStoredFilename(String prefix, String originalFilename) {
        String extension = extractExtension(originalFilename);
        String safePrefix = prefix.replaceAll("[^a-zA-Z0-9_-]", "");
        return safePrefix + "-" + Instant.now().toEpochMilli() + "-" + UUID.randomUUID().toString().substring(0, 8) + extension;
    }

    private String extractExtension(String originalFilename) {
        String cleaned = cleanOriginalFilename(originalFilename);
        int dotIndex = cleaned.lastIndexOf('.');
        return dotIndex >= 0 ? cleaned.substring(dotIndex).toLowerCase(Locale.ROOT) : "";
    }

    private String cleanOriginalFilename(String originalFilename) {
        String cleaned = StringUtils.cleanPath(originalFilename == null ? "upload" : originalFilename);
        return cleaned.replace("..", "");
    }

    private String cleanStorageFilename(String filename) {
        String cleaned = StringUtils.cleanPath(filename);
        if (cleaned.contains("..")) {
            throw new ResponseStatusException(BAD_REQUEST, "Invalid file reference");
        }
        return cleaned;
    }

    private String normalizeContentType(String contentType, String fallback) {
        if (contentType == null || contentType.isBlank()) {
            return fallback;
        }
        return contentType.toLowerCase(Locale.ROOT);
    }
}
