package com.filipwiecha.auth.sessions.services;

import java.util.concurrent.TimeUnit;
import org.springframework.data.domain.Range;
import org.springframework.data.redis.connection.Limit;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j

/**
 *  Odbieranie aktualizacji sesji w redis i wysyłka do kafki
 * 
 * SessionOutboxPublisher
 */
public class SessionOutboxPublisher {
    private final StringRedisTemplate redis;
    private final KafkaTemplate<String, String> kafka;

    @Scheduled(fixedDelayString = "${sessions.outbox.delay-ms:1000}")
    public void publishPending() {
        try {
            
            var events = redis.<String, String>opsForStream().range(
                RedisSessionService.OUTBOX, 
                Range.unbounded(), 
                Limit.limit().count(100)
            );

            if (events == null) return;

            for (var event : events) {
                
                kafka
                    .send(
                        "session-events", 
                        event.getValue().get("sessionId"),
                        event.getValue().get("json")
                    )
                    .get(
                        10, 
                        TimeUnit.SECONDS
                    );

                redis.opsForStream().delete(RedisSessionService.OUTBOX, event.getId());
            }
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();

        } catch (Exception ex) {
            log.warn("Session outbox publication failed; pending events will be retried", ex);
            
        }
    }
}
