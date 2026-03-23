package com.nuranova.education.security;

import com.nuranova.education.model.UserAccount;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationSeconds;
    private final String cookieName;

    public JwtService(
            @Value("${app.security.jwt-secret}") String secret,
            @Value("${app.security.jwt-expiration-seconds}") long expirationSeconds,
            @Value("${app.security.cookie-name}") String cookieName
    ) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationSeconds = expirationSeconds;
        this.cookieName = cookieName;
    }

    public String generateToken(UserAccount user) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(expirationSeconds);

        return Jwts.builder()
                .subject(user.getUsername())
                .claim("role", user.getRole().name())
                .claim("uid", user.getId())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(signingKey)
                .compact();
    }

    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, String username) {
        Claims claims = parseClaims(token);
        Date expiration = claims.getExpiration();
        return claims.getSubject().equals(username) && expiration.after(new Date());
    }

    public ResponseCookie buildAuthCookie(String token) {
        return ResponseCookie.from(cookieName, token)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofSeconds(expirationSeconds))
                .build();
    }

    public ResponseCookie clearAuthCookie() {
        return ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ZERO)
                .build();
    }

    public String getCookieName() {
        return cookieName;
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
