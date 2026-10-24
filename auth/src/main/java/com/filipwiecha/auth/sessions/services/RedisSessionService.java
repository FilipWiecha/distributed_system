package com.filipwiecha.auth.sessions.services;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import tools.jackson.databind.ObjectMapper;
import com.filipwiecha.auth.sessions.models.Sessions;

@Service
@RequiredArgsConstructor
public class RedisSessionService {
    public static final String OUTBOX = "auth:{sessions}:outbox";
    private final StringRedisTemplate redis;
    private final ObjectMapper objectMapper;
    public record Snapshot(Sessions session, String json) {}

    /*
        Atomowe tworzenie, odnawianie, unieważnianie sesji, przy jednoczesnej wysyłce nowej encji sesji do zdażeń(Redis stream).
    */
    static final DefaultRedisScript<Long> MUTATE = new DefaultRedisScript<>("""
        local mode = ARGV[1]
        local current = redis.call('GET', KEYS[1])
        local updated = ARGV[3]
        local ttl = tonumber(ARGV[4])

        if mode == 'create' then
            if current then return 0 end
            if not ttl or ttl <= 0 then return 0 end

        else
            if not current then return 0 end
            ttl = redis.call('PTTL', KEYS[1])
            if ttl <= 0 then return 0 end
            local state = cjson.decode(current)

            if mode == 'revoke' then
                if state.userId ~= ARGV[2] then return -1 end
                if state.revoked then return 1 end
                state.revoked = true
                updated = cjson.encode(state)

            elseif mode == 'rotate' then
                if current ~= ARGV[2] or state.revoked then return 0 end

            else
                return 0
            end

        end

        local event = cjson.decode(updated)
        local record = redis.pcall(
                            'XADD', 
                            KEYS[2], 
                            '*', 
                            'sessionId', 
                            event.sessionId, 
                            'json', 
                            updated
                        )

        if type(record) == 'table' and record.err then 
            return redis.error_reply(record.err) 
        end

        local result = redis.pcall(
                        'SET', 
                        KEYS[1], 
                        updated, 
                        'PX', 
                        ttl
                    )

        if type(result) == 'table' and result.err then
            redis.call('XDEL', KEYS[2], record)
            return redis.error_reply(result.err)
        end

        return 1
        """, Long.class);

    static String key(UUID id) { return "auth:{sessions}:" + id; }

    public Snapshot find(UUID id) {
        String json = redis.opsForValue().get(key(id));

        if (json == null || json.isBlank()) {
            throw new IllegalArgumentException("Session unavailable");
        }

        return new Snapshot(
            objectMapper.readValue(json, Sessions.class), 
            json
        );
    }

    public boolean create(Sessions session) {

        long ttl = Duration.between(LocalDateTime.now(), session.getExpiresAt()).toMillis();
        if (ttl <= 0) throw new IllegalArgumentException("Session already expired");

        return mutate(
            session.getSessionId(), 
            "create", 
            "", 
            objectMapper.writeValueAsString(session), 
            ttl
        );
    }

    public boolean rotate(
        Snapshot expected, 
        Sessions updated
    ) {
        
        return mutate(
            expected.session().getSessionId(), 
            "rotate", 
            expected.json(),
            objectMapper.writeValueAsString(updated), 0
        );
    }

    public boolean revoke(
        UUID id, 
        UUID owner
    ) {
        
        return mutate(
            id, 
            "revoke", 
            owner.toString(), 
            "", 
            0
        );
    }

    private boolean mutate(
        UUID id, 
        String mode, 
        String expected, 
        String json, 
        long ttl
    ) {

        return Long.valueOf(1).equals(
            redis.execute(
                MUTATE,
                List.of(key(id), OUTBOX), 
                mode, 
                expected, 
                json, 
                Long.toString(ttl)
            )
        );
    }
}

