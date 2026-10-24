package com.filipwiecha.auth.sessions.utils;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

import com.filipwiecha.auth.sessions.config.HmacKeyProperties;


@Component
@EnableConfigurationProperties(HmacKeyProperties.class)
public class RefreshTokenComponent {
    
    public final int refreshExpiresDays;
    private final SecretKeySpec keySpec;
    private final Base64.Encoder URL_ENCODER = Base64.getUrlEncoder().withoutPadding();

    public RefreshTokenComponent(
        @Value("${tokens.refreshtoken.exp}") int refreshExpiresDays,
        HmacKeyProperties keyString
    ){   
        this.refreshExpiresDays = refreshExpiresDays;
        this.keySpec = keyString.getSecretKeySpec();
    }

    public record ParsedToken(
        UUID sessionId, 
        byte[] incomingSecretHash
    ){}

    public record GeneratedToken(
            UUID sessionId,
            int rotationCounter,
            String compoundTokenForClient,
            byte[] secretHashForDb         
    ) {}

    public GeneratedToken createForNewSession() {
        UUID newSessionId = UUID.randomUUID();
        
        return createForExistingSession(newSessionId, 0);
    }

    public GeneratedToken createForExistingSession(UUID sessionId, int rotationCounter) {
        rotationCounter = Math.incrementExact(rotationCounter);
        String rawSecret = deriveOpaqueSecret(sessionId, rotationCounter);
        byte[] secretHash = sha256(rawSecret);
        String compoundToken = sessionId.toString() + "." + rawSecret;

        return new GeneratedToken(sessionId, rotationCounter, compoundToken, secretHash);
    }

    public ParsedToken parseFromClient(String compoundToken) {
        if (compoundToken == null || compoundToken.isBlank() || compoundToken.length() > 256) {
            throw new IllegalArgumentException("Brak tokena");
        }

        String[] parts = compoundToken.split("\\.", 2);
        if (parts.length != 2 || parts[1].isBlank()) {
            throw new IllegalArgumentException("Nieprawidłowy format tokena złożonego");
        }

        try {
            UUID sessionId = UUID.fromString(parts[0]);
            byte[] incomingHash = sha256(parts[1]);
            return new ParsedToken(sessionId, incomingHash);

        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Nieprawidłowy format UUID w session_id", e);
        }
    }


    private String deriveOpaqueSecret(UUID sessionId, int rotationCounter){
        try {
            Mac mac = Mac.getInstance(keySpec.getAlgorithm());
            mac.init(this.keySpec);
            
            byte[] payload = (sessionId.toString() + ':' + rotationCounter).getBytes(StandardCharsets.UTF_8);
            byte[] rawHmac = mac.doFinal(payload);

            return this.URL_ENCODER.encodeToString(rawHmac);
        } 
        catch (NoSuchAlgorithmException | InvalidKeyException e) {
            
            throw new IllegalStateException("Błąd HmacSHA256", e);
        }
    }

    private byte[] sha256(String rawSecret){
        try{
            MessageDigest digest =  MessageDigest.getInstance("SHA-256");

            return digest.digest(rawSecret.getBytes(StandardCharsets.UTF_8));
        }
        catch(NoSuchAlgorithmException e){
            
            throw new IllegalArgumentException("Brak SHA-256");
        }
    }

}

