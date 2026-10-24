package com.filipwiecha.auth.sessions.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.filipwiecha.auth.sessions.models.Sessions;

public interface SessionRepository extends JpaRepository<Sessions, UUID> {

    Optional<Sessions> findBySessionId(UUID sessionId);
    List<Sessions> findByUserIdAndRevokedFalse(UUID userId);
    Slice<Sessions> findByUserId(UUID userId, Pageable pageable);
    Optional<Sessions> findBySessionIdAndUserId(UUID sessionId, UUID userId);

    @Transactional
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("""
        UPDATE Sessions s
        SET s.previousTokenHash = s.currentTokenHash,
            s.currentTokenHash = :newTokenHash,
            s.rotationCounter = s.rotationCounter + 1,
            s.rotatedAt = :now
        WHERE s.sessionId = :sessionId
          AND s.rotationCounter = :expectedCounter
          AND s.currentTokenHash = :expectedTokenHash
          AND s.revoked = false
          AND s.expiresAt > :now
        """)
    int rotateSession(
        @Param("sessionId") UUID sessionId,
        @Param("expectedCounter") int expectedCounter,
        @Param("expectedTokenHash") byte[] expectedTokenHash,
        @Param("newTokenHash") byte[] newTokenHash,
        @Param("now") LocalDateTime now
    );


    @Transactional
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("""
        UPDATE Sessions s
        SET s.revoked = true
        WHERE s.sessionId = :sessionId
        AND s.revoked = false
        """)
    int revokeSession(@Param("sessionId") UUID sessionId);
}
