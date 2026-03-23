package com.nuranova.education.service;

import com.nuranova.education.model.Role;
import com.nuranova.education.model.UserAccount;
import com.nuranova.education.repo.LessonAccessGrantRepository;
import com.nuranova.education.repo.LessonProgressRepository;
import com.nuranova.education.repo.UserAccountRepository;
import com.nuranova.education.security.JwtService;
import com.nuranova.education.web.ApiDtos.AuthResponse;
import com.nuranova.education.web.ApiDtos.ChangePasswordRequest;
import com.nuranova.education.web.ApiDtos.LoginRequest;
import com.nuranova.education.web.ApiDtos.ProfileUpdateRequest;
import com.nuranova.education.web.ApiDtos.RegisterRequest;
import com.nuranova.education.web.ApiDtos.UserResponse;
import java.util.Locale;
import java.util.Set;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
@Transactional
public class AuthService {

    private static final long MAX_AVATAR_SIZE_BYTES = 800L * 1024L;
    private static final Set<String> IMAGE_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/gif");

    private final UserAccountRepository userAccountRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final LessonAccessGrantRepository lessonAccessGrantRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final MediaStorageService mediaStorageService;

    public AuthService(
            UserAccountRepository userAccountRepository,
            LessonProgressRepository lessonProgressRepository,
            LessonAccessGrantRepository lessonAccessGrantRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            MediaStorageService mediaStorageService
    ) {
        this.userAccountRepository = userAccountRepository;
        this.lessonProgressRepository = lessonProgressRepository;
        this.lessonAccessGrantRepository = lessonAccessGrantRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.mediaStorageService = mediaStorageService;
    }

    public AuthResult register(RegisterRequest request) {
        String username = request.username().trim();
        String email = request.email().trim().toLowerCase(Locale.ROOT);

        ensureUsernameAvailable(username, null);
        ensureEmailAvailable(email, null);

        UserAccount user = UserAccount.builder()
                .username(username)
                .email(email)
                .fullName(request.fullName().trim())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .build();

        UserAccount savedUser = userAccountRepository.save(user);
        return buildAuthResult(savedUser, "Account created successfully");
    }

    public AuthResult login(LoginRequest request) {
        UserAccount user = userAccountRepository
                .findByUsernameOrEmail(request.usernameOrEmail().trim(), request.usernameOrEmail().trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "Invalid username or password"));

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(UNAUTHORIZED, "Invalid username or password");
        }

        return buildAuthResult(user, "Login successful");
    }

    @Transactional(readOnly = true)
    public UserAccount getRequiredUser(String username) {
        return userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
    }

    @Transactional(readOnly = true)
    public UserAccount getRequiredUserById(Long userId) {
        return userAccountRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
    }

    public UserResponse updateProfile(String username, ProfileUpdateRequest request) {
        UserAccount user = getRequiredUser(username);
        String normalizedUsername = request.username().trim();
        String normalizedEmail = request.email().trim().toLowerCase(Locale.ROOT);

        ensureUsernameAvailable(normalizedUsername, user.getId());
        ensureEmailAvailable(normalizedEmail, user.getId());

        user.setUsername(normalizedUsername);
        user.setFullName(request.fullName().trim());
        user.setEmail(normalizedEmail);
        user.setBio(normalizeOptionalText(request.bio()));

        return toUserResponse(userAccountRepository.save(user));
    }

    public UserResponse uploadAvatar(String username, MultipartFile file) {
        UserAccount user = getRequiredUser(username);
        validateAvatarFile(file);

        mediaStorageService.deleteAvatarByUrl(user.getAvatarUrl());
        user.setAvatarContentType(normalizeContentType(file.getContentType()));

        try {
            user.setAvatarData(file.getBytes());
        } catch (Exception exception) {
            throw new ResponseStatusException(BAD_REQUEST, "Unable to read the selected image");
        }

        user.setAvatarUrl(buildDatabaseAvatarUrl(user.getId()));
        return toUserResponse(userAccountRepository.save(user));
    }

    public UserResponse deleteAvatar(String username) {
        UserAccount user = getRequiredUser(username);
        mediaStorageService.deleteAvatarByUrl(user.getAvatarUrl());
        user.setAvatarUrl(null);
        user.setAvatarContentType(null);
        user.setAvatarData(null);
        return toUserResponse(userAccountRepository.save(user));
    }

    public UserResponse changePassword(String username, ChangePasswordRequest request) {
        UserAccount user = getRequiredUser(username);

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(UNAUTHORIZED, "Current password is incorrect");
        }

        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(BAD_REQUEST, "Choose a new password that is different from the current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        return toUserResponse(userAccountRepository.save(user));
    }

    public void deleteAccount(String username) {
        UserAccount user = getRequiredUser(username);
        if ("nuranova".equalsIgnoreCase(user.getUsername())) {
            throw new ResponseStatusException(BAD_REQUEST, "The default admin account cannot be deleted");
        }

        lessonAccessGrantRepository.deleteAll(
                lessonAccessGrantRepository.findAll().stream()
                        .filter(grant -> user.getId().equals(grant.getUser().getId()))
                        .toList()
        );

        lessonProgressRepository.deleteAll(
                lessonProgressRepository.findAll().stream()
                        .filter(progress -> user.getId().equals(progress.getUser().getId()))
                        .toList()
        );

        mediaStorageService.deleteAvatarByUrl(user.getAvatarUrl());
        userAccountRepository.delete(user);
    }

    public ResponseCookie clearSessionCookie() {
        return jwtService.clearAuthCookie();
    }

    public UserResponse toUserResponse(UserAccount user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getBio(),
                user.getAvatarUrl(),
                user.getRole(),
                user.getProvider()
        );
    }

    private AuthResult buildAuthResult(UserAccount user, String message) {
        String token = jwtService.generateToken(user);
        return new AuthResult(
                new AuthResponse(toUserResponse(user), message),
                jwtService.buildAuthCookie(token)
        );
    }

    private void ensureUsernameAvailable(String username, Long ignoreUserId) {
        userAccountRepository.findAll().stream()
                .filter(existing -> existing.getUsername() != null && existing.getUsername().equalsIgnoreCase(username))
                .filter(existing -> ignoreUserId == null || !existing.getId().equals(ignoreUserId))
                .findFirst()
                .ifPresent(existing -> {
                    throw new ResponseStatusException(BAD_REQUEST, "Username is already in use");
                });
    }

    private void ensureEmailAvailable(String email, Long ignoreUserId) {
        userAccountRepository.findByEmail(email)
                .filter(existing -> ignoreUserId == null || !existing.getId().equals(ignoreUserId))
                .ifPresent(existing -> {
                    throw new ResponseStatusException(BAD_REQUEST, "Email is already in use");
                });
    }

    private void validateAvatarFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "Select an image to upload");
        }

        String contentType = normalizeContentType(file.getContentType());
        if (!IMAGE_TYPES.contains(contentType)) {
            throw new ResponseStatusException(BAD_REQUEST, "Profile images must be JPG, PNG, WEBP, or GIF");
        }

        if (file.getSize() > MAX_AVATAR_SIZE_BYTES) {
            throw new ResponseStatusException(BAD_REQUEST, "Profile images must be 800KB or smaller");
        }
    }

    private String normalizeOptionalText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private String normalizeContentType(String contentType) {
        return contentType == null ? "" : contentType.toLowerCase(Locale.ROOT);
    }

    private String buildDatabaseAvatarUrl(Long userId) {
        return "/api/media/avatar-users/" + userId;
    }

    public record AuthResult(AuthResponse response, ResponseCookie cookie) {
    }
}
