package com.filipwiecha.auth.user.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.filipwiecha.auth.user.models.User;

public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findByUsername(String username);
    boolean existsByUsernameOrEmail(String username, String email);


    @Transactional
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("""
        UPDATE User u
        SET u.password = :newPassword
        WHERE u.id = :userId
          AND u.password = :currentPassword
    """)
    int changePassword(
        @Param("newPassword") String newPassword, 
        @Param("currentPassword") String currentPassword,
        @Param("userId") UUID userId
    );

    @Transactional
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("""
        UPDATE User u
        SET u.enabled = false
        WHERE u.id = :userId
    """)
    int disableUser(
        @Param("userId") UUID userId
    );

}

