package com.filipwiecha.auth.user.services;

import java.time.Duration;
import java.util.UUID;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.filipwiecha.auth.user.models.User;
import com.filipwiecha.auth.user.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor 
public class RedisUserService {
    
    private final StringRedisTemplate redis;
    private final UserRepository userRepository;
    private ObjectMapper objectMapper = new ObjectMapper();

    public record UserRedis(
        UUID userId, 
        String Roles, 
        boolean enabled,
        boolean accountLocked,
        boolean accountExpired,
        boolean credentialsExpired
    ){}

    private UserRedis from(User user){
        UserRedis ur = new UserRedis(
            user.getId(),
            user.getRoles(), 
            user.isEnabled(), 
            user.isAccountLocked(),
            user.isAccountExpired(),
            user.isCredentialsExpired()
            );

        return ur;
    }

    private static String key(UUID userId){
        return "auth:user:"+userId;
    }

    public UserRedis getUser(UUID userId){
        String userRedisJson = this.redis.opsForValue().get(key(userId));
        UserRedis userRedis;
        
        if(userRedisJson == null || userRedisJson.isBlank()){
            User userFromDb = this.userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("User not found"));
            userRedis = this.from(userFromDb);
            
            this.createUser(userRedis);
        }
        else{
            userRedis = this.objectMapper.readValue(userRedisJson, UserRedis.class);
        }


        return isActive(userRedis);
    }

    public void createUser(UserRedis userRedis){
        this.redis.opsForValue().set(key(userRedis.userId), this.objectMapper.writeValueAsString(userRedis), Duration.ofMinutes(30));
    }

    public void createUser(User user){
        UserRedis userRedis = this.from(user);
        this.redis.opsForValue().set(key(userRedis.userId), this.objectMapper.writeValueAsString(userRedis), Duration.ofMinutes(30));
    }

    public void deleteUser(UUID userId){
        this.redis.delete(key(userId));
    }

    private static UserRedis isActive(UserRedis user) {
        if (!user.enabled()
                || user.accountLocked()
                || user.accountExpired()
                || user.credentialsExpired()) {
            throw new AccessDeniedException("Account unavailable");
        }

        return user;
    }
}
