package com.filipwiecha.queueclient.models;

import java.net.InetAddress;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_sessions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Sessions {
    
    @Id
    @Column(nullable = false)
    private UUID sessionId;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String platform;

    @Column(nullable = false)
    private byte[] currentTokenHash;

    @Column(nullable = true)
    private byte[] previousTokenHash;

    @Column(nullable = false)
    private int rotationCounter;

    @Column(nullable = false)
    private boolean revoked;

    @Column(nullable = false)
    private LocalDateTime rotatedAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = true)
    private InetAddress ipAddress;

    @Column(nullable = true)
    private String userAgent;
}
