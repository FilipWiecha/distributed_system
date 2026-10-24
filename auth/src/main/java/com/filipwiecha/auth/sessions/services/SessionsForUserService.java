package com.filipwiecha.auth.sessions.services;

import java.util.List;
import java.util.UUID;


import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.filipwiecha.auth.sessions.models.Sessions;
import com.filipwiecha.auth.sessions.repositories.SessionRepository;
import com.filipwiecha.auth.sessions.services.RedisSessionService.Snapshot;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class SessionsForUserService {
    
    private final SessionRepository sessionRepository;
    private final RedisSessionService redisSessionService;

    private static final int PAGE_SIZE = 5;


    @Transactional(readOnly = true)
    public Slice<Sessions> getSlicedSessions(UUID userId, int pageNumber){
        Pageable pageable = PageRequest
                                .of(
                                    pageNumber, 
                                    PAGE_SIZE, 
                                    Sort.by("rotatedAt").descending()
                            );

        Slice<Sessions> sessionsSlice = this.sessionRepository.findByUserId(userId, pageable);

        return sessionsSlice;
    }

    @Transactional(readOnly = true)
    public Sessions getSession(UUID sessionId, UUID userId){
       
        return this.sessionRepository
            .findBySessionIdAndUserId(sessionId, userId)
            .orElseThrow(()-> new IllegalArgumentException("Session not found"));
    }

    @Transactional
    public void revokeAll(UUID userId){
        List<Sessions> sessionsList = this.sessionRepository.findByUserIdAndRevokedFalse(userId);

        if(sessionsList.isEmpty()){
            throw new IllegalArgumentException("Not active sessions");
        }

        for(Sessions s : sessionsList){
            if(!redisSessionService.revoke(s.getSessionId(), s.getUserId())){
                throw new IllegalStateException("Cannot revoke all sessions");
            }
        }

    }

    @Transactional  
    public void revokeSession(UUID sessionId, UUID userId){
        Snapshot sessions = this.redisSessionService.find(sessionId);
        if(sessions.session().isRevoked()){
            throw new IllegalArgumentException("Session already revoked");
        }

        redisSessionService.revoke(sessionId, userId);
    }
}
