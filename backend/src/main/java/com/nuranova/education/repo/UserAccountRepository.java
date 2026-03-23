package com.nuranova.education.repo;

import com.nuranova.education.model.UserAccount;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByUsername(String username);
    Optional<UserAccount> findByEmail(String email);
    Optional<UserAccount> findByUsernameOrEmail(String username, String email);
    boolean existsByUsernameIgnoreCase(String username);
    boolean existsByEmailIgnoreCase(String email);
}
