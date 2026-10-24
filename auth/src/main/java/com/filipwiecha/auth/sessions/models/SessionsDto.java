package com.filipwiecha.auth.sessions.models;

import java.net.InetAddress;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessionsDto {
    
    private UUID sessionId;
    private String platform;
    private boolean revoked;
    private LocalDateTime rotatedAt;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private InetAddress ipAddress;
    private String userAgent;

    public SessionsDto(Sessions sessions){
        this.sessionId = sessions.getSessionId();
        this.platform = sessions.getPlatform();
        this.revoked = sessions.isRevoked();
        this.rotatedAt = sessions.getRotatedAt();
        this.expiresAt = sessions.getExpiresAt();
        this.createdAt = sessions.getCreatedAt();
        this.ipAddress = sessions.getIpAddress();
        this.userAgent = sessions.getUserAgent();
    }


    public static List<SessionsDto> toList(List<Sessions> sessions){
        return sessions.stream().map(SessionsDto::new).toList();
    }
}
