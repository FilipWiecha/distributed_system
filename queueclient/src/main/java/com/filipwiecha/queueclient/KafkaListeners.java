package com.filipwiecha.queueclient;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import com.filipwiecha.queueclient.models.Sessions;
import com.filipwiecha.queueclient.services.SessionService;
import lombok.RequiredArgsConstructor;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
public class KafkaListeners {
    private final SessionService sessionService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "session-events", groupId = "session-projection-v2")
    public void onSessionEvent(String json) {
        sessionService.applySnapshot(objectMapper.readValue(json, Sessions.class));
    }
}
