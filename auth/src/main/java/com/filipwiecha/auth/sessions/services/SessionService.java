package com.filipwiecha.auth.sessions.services;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import com.filipwiecha.auth.sessions.models.Sessions;
import com.filipwiecha.auth.sessions.models.TokensResponse;
import com.filipwiecha.auth.sessions.utils.AccessTokenComponent;
import com.filipwiecha.auth.sessions.utils.RefreshTokenComponent;
import com.filipwiecha.auth.user.services.RedisUserService;
import com.filipwiecha.auth.user.services.RedisUserService.UserRedis;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SessionService {
    
    private final AccessTokenComponent accessTokenComp;
    private final RefreshTokenComponent refreshTokenComp;
    private final RedisSessionService redisSessionService;
    private final RedisUserService redisUserService;

    public TokensResponse generateNewSession(HttpServletRequest request, UUID userId, String roles) {
        
        UserRedis user = redisUserService.getUser(userId);
        var refresh = refreshTokenComp.createForNewSession();
        var now = LocalDateTime.now();
        Sessions session = new Sessions();

        session.setSessionId(refresh.sessionId());
        session.setUserId(userId);
        session.setPlatform("WEB");
        session.setCurrentTokenHash(refresh.secretHashForDb());
        session.setRotationCounter(refresh.rotationCounter());
        session.setExpiresAt(now.plusDays(refreshTokenComp.refreshExpiresDays));
        session.setRotatedAt(now);
        session.setCreatedAt(now);

        String userAgent = request.getHeader("user-agent");
        session.setUserAgent(userAgent);

        try{
            InetAddress address = InetAddress.getByName(request.getRemoteAddr());
            session.setIpAddress(address);
        }catch(UnknownHostException ex){}

        String access = accessTokenComp.generateAccessKey(userId, user.Roles());

        if (!redisSessionService.create(session)) {
            throw new IllegalStateException("Session already exists");
        }
        return TokensResponse.builder()
            .accessToken(access)
            .refreshToken(refresh.compoundTokenForClient())
            .build();
    }

    public TokensResponse rotateRefreshToken(String refreshToken) {
        var parsed = refreshTokenComp.parseFromClient(refreshToken);
        var snapshot = redisSessionService.find(parsed.sessionId());
        var session = snapshot.session();

        if (
            session.isRevoked() || 
            !session.getExpiresAt().isAfter(LocalDateTime.now())|| 
            !MessageDigest.isEqual(session.getCurrentTokenHash(), parsed.incomingSecretHash())
        ) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        
        UserRedis user = redisUserService.getUser(session.getUserId());
        var refresh = refreshTokenComp.createForExistingSession(session.getSessionId(), session.getRotationCounter());
        String access = accessTokenComp.generateAccessKey(user.userId(), user.Roles());

        session.setPreviousTokenHash(session.getCurrentTokenHash());
        session.setCurrentTokenHash(refresh.secretHashForDb());
        session.setRotationCounter(refresh.rotationCounter());
        session.setRotatedAt(LocalDateTime.now());

        if (!redisSessionService.rotate(snapshot, session)) {
            throw new IllegalArgumentException("Session expired, revoked or already rotated");
        }

        return TokensResponse.builder()
            .accessToken(access)
            .refreshToken(refresh.compoundTokenForClient())
            .build();
    }

    public void logoutSession(String refreshToken, UUID userId) {
        var parsed = refreshTokenComp.parseFromClient(refreshToken);

        if (!redisSessionService.revoke(parsed.sessionId(), userId)) {
            throw new AccessDeniedException("Session unavailable");
        }
    }
}
