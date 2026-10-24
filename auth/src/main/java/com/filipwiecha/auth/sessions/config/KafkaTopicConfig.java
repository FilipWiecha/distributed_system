package com.filipwiecha.auth.sessions.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {
    @Bean
    public NewTopic sessionEvents() {
        return TopicBuilder.name("session-events").partitions(3).replicas(1).build();
    }
}
