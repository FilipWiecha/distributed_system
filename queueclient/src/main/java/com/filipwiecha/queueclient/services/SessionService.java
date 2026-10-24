package com.filipwiecha.queueclient.services;

import java.sql.Timestamp;
import java.util.Objects;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.filipwiecha.queueclient.models.Sessions;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SessionService {
    private final NamedParameterJdbcTemplate jdbc;
    private final RedisSessionService redisSessionService;

    static final String UPSERT = """
        INSERT INTO user_sessions (session_id, user_id, platform, current_token_hash,
            previous_token_hash, rotation_counter, revoked, rotated_at, expires_at,
            created_at, ip_address, user_agent)
        VALUES (:id, :userId, :platform, :currentHash, :previousHash, :counter,
            :revoked, :rotatedAt, :expiresAt, :createdAt, CAST(:ip AS inet), :agent)
        ON CONFLICT (session_id) DO UPDATE SET
            current_token_hash = EXCLUDED.current_token_hash,
            previous_token_hash = EXCLUDED.previous_token_hash,
            rotation_counter = EXCLUDED.rotation_counter,
            revoked = EXCLUDED.revoked,
            rotated_at = EXCLUDED.rotated_at
        WHERE user_sessions.user_id = EXCLUDED.user_id
          AND NOT user_sessions.revoked
          AND (EXCLUDED.rotation_counter > user_sessions.rotation_counter
            OR (EXCLUDED.rotation_counter = user_sessions.rotation_counter
                AND EXCLUDED.revoked))
        """;

    @Transactional
    public void applySnapshot(Sessions session) {

        Objects.requireNonNull(session, "Missing session");
        Objects.requireNonNull(session.getSessionId(), "Missing sessionId");
        Objects.requireNonNull(session.getUserId(), "Missing userId");
        Objects.requireNonNull(session.getCurrentTokenHash(), "Missing token hash");

        if (session.getRotationCounter() < 1) throw new IllegalArgumentException("Invalid rotation counter");

        var parameters = new MapSqlParameterSource()
            .addValue("id", session.getSessionId())
            .addValue("userId", session.getUserId())
            .addValue("platform", session.getPlatform())
            .addValue("currentHash", session.getCurrentTokenHash(), java.sql.Types.BINARY)
            .addValue("previousHash", session.getPreviousTokenHash(), java.sql.Types.BINARY)
            .addValue("counter", session.getRotationCounter())
            .addValue("revoked", session.isRevoked())
            .addValue("rotatedAt", Timestamp.valueOf(session.getRotatedAt()))
            .addValue("expiresAt", Timestamp.valueOf(session.getExpiresAt()))
            .addValue("createdAt", Timestamp.valueOf(session.getCreatedAt()))
            .addValue("ip", session.getIpAddress() == null ? null : session.getIpAddress().getHostAddress(), java.sql.Types.VARCHAR)
            .addValue("agent", session.getUserAgent(), java.sql.Types.VARCHAR);

        jdbc.update(UPSERT, parameters);

        if(session.isRevoked() == true){
            this.redisSessionService.deleteSession(session.getSessionId());
        }
    }
}
