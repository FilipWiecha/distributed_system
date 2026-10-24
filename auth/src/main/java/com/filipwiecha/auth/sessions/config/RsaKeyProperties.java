package com.filipwiecha.auth.sessions.config;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "tokens.accesstoken.keys")
public record RsaKeyProperties(RSAPublicKey publicKey, RSAPrivateKey privateKey) {}
