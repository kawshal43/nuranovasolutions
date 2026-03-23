package com.nuranova.education.web;

import com.nuranova.education.service.AuthService;
import com.nuranova.education.web.ApiDtos.AuthResponse;
import com.nuranova.education.web.ApiDtos.LoginRequest;
import com.nuranova.education.web.ApiDtos.MessageResponse;
import com.nuranova.education.web.ApiDtos.RegisterRequest;
import com.nuranova.education.web.ApiDtos.UserResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthService.AuthResult result = authService.register(request);
        return ResponseEntity.ok()
                .header("Set-Cookie", result.cookie().toString())
                .body(result.response());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthService.AuthResult result = authService.login(request);
        return ResponseEntity.ok()
                .header("Set-Cookie", result.cookie().toString())
                .body(result.response());
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout() {
        return ResponseEntity.ok()
                .header("Set-Cookie", authService.clearSessionCookie().toString())
                .body(new MessageResponse("Logged out successfully"));
    }

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(UNAUTHORIZED, "Not authenticated");
        }

        return authService.toUserResponse(authService.getRequiredUser(authentication.getName()));
    }
}
