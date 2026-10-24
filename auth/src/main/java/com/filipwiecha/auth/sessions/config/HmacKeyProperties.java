package com.filipwiecha.auth.sessions.config;

import java.util.HexFormat;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties (prefix = "tokens.refreshtoken")
public record HmacKeyProperties(String key, String algorithm) {

    public SecretKeySpec getSecretKeySpec(){
        byte[] keyBytes = HexFormat.of().parseHex(key);
        if(keyBytes.length < 32){
            throw new IllegalArgumentException("Klucz Hmac musi mieć min. 32 bajty");
        }

        return new SecretKeySpec(keyBytes, algorithm);
    }
}
