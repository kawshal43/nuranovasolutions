package com.nuranova.education.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String username;

    @Column(nullable = false, unique = true, length = 180)
    private String email;

    @Column(nullable = false, length = 180)
    private String fullName;

    @Column(length = 1200)
    private String bio;

    @Column(length = 255)
    private String passwordHash;

    @Column(length = 255)
    private String avatarUrl;

    @Column(length = 80)
    private String avatarContentType;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] avatarData;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AuthProvider provider;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    public void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;

        if (role == null) {
            role = Role.USER;
        }

        if (provider == null) {
            provider = AuthProvider.LOCAL;
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = Instant.now();
    }
}
