package com.filipwiecha.auth.sessions.utils;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;

@Component
public class AccessTokenComponent {
    
    private final JwtEncoder jwtEncoder;
    private final String name;
    private final int minutesToExp;

    public AccessTokenComponent(
        JwtEncoder jwtEncoder, 
        @Value("${spring.application.name}") String name,
        @Value("${tokens.accesstoken.exp}") int exp
    ){
        this.jwtEncoder = jwtEncoder;
        this.name = name;
        this.minutesToExp = exp;
    }

    public String generateAccessKey(UUID userId, String roles){
        
        Instant timeNow = Instant.now();
        
        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
            .issuer(this.name)
            .issuedAt(timeNow)
            .expiresAt(timeNow.plus(this.minutesToExp, ChronoUnit.MINUTES))
            .claim("roles", roles)
            .subject(userId.toString())
            .build();

        return this.jwtEncoder.encode(JwtEncoderParameters.from(claimsSet)).getTokenValue();
    }
}
