package com.filipwiecha.queueclient.services;

import java.util.UUID;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RedisSessionService {
    
    private final StringRedisTemplate redis;

    static String key(UUID id) { return "auth:{sessions}:" + id; }

    public void deleteSession(UUID sessionId){
        this.redis.delete(key(sessionId));
    }
}
