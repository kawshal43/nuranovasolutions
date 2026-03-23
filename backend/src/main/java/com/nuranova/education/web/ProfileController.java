package com.nuranova.education.web;

import com.nuranova.education.service.AuthService;
import com.nuranova.education.web.ApiDtos.ChangePasswordRequest;
import com.nuranova.education.web.ApiDtos.MessageResponse;
import com.nuranova.education.web.ApiDtos.ProfileUpdateRequest;
import com.nuranova.education.web.ApiDtos.UserResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final AuthService authService;

    public ProfileController(AuthService authService) {
        this.authService = authService;
    }

    @PutMapping("/me")
    public UserResponse updateProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest request
    ) {
        return authService.updateProfile(authentication.getName(), request);
    }

    @PostMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UserResponse uploadAvatar(
            Authentication authentication,
            @RequestParam("file") MultipartFile file
    ) {
        return authService.uploadAvatar(authentication.getName(), file);
    }

    @DeleteMapping("/me/avatar")
    public UserResponse deleteAvatar(Authentication authentication) {
        return authService.deleteAvatar(authentication.getName());
    }

    @PutMapping("/me/password")
    public UserResponse changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        return authService.changePassword(authentication.getName(), request);
    }

    @DeleteMapping("/me")
    public ResponseEntity<MessageResponse> deleteAccount(Authentication authentication) {
        authService.deleteAccount(authentication.getName());
        return ResponseEntity.ok()
                .header("Set-Cookie", authService.clearSessionCookie().toString())
                .body(new MessageResponse("Account deleted successfully"));
    }
}
