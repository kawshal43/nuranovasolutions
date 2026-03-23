package com.nuranova.education.service;

import com.nuranova.education.model.Lesson;
import com.nuranova.education.model.UserAccount;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class MediaTokenService {

    private final SecretKey signingKey;
    private final long expirationSeconds;

    public MediaTokenService(
            @Value("${app.security.jwt-secret}") String secret,
            @Value("${app.media.playback-token-expiration-seconds}") long expirationSeconds
    ) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationSeconds = expirationSeconds;
    }

    public String generateLessonPlaybackToken(UserAccount user, Lesson lesson) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(expirationSeconds);

        return Jwts.builder()
                .subject(user.getUsername())
                .claim("uid", user.getId())
                .claim("lessonId", lesson.getId())
                .claim("type", "lesson-playback")
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(signingKey)
                .compact();
    }

    public boolean isLessonPlaybackTokenValid(String token, UserAccount user, Lesson lesson) {
        Claims claims;
        try {
            claims = parseClaims(token);
        } catch (Exception exception) {
            return false;
        }

        Date expiration = claims.getExpiration();
        Object userIdClaim = claims.get("uid");
        Object lessonIdClaim = claims.get("lessonId");
        Object typeClaim = claims.get("type");

        if (expiration == null || !expiration.after(new Date())) {
            return false;
        }

        return user.getUsername().equals(claims.getSubject())
                && userIdClaim instanceof Number numberUserId
                && lessonIdClaim instanceof Number numberLessonId
                && "lesson-playback".equals(typeClaim)
                && user.getId().equals(numberUserId.longValue())
                && lesson.getId().equals(numberLessonId.longValue());
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
