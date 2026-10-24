package com.filipwiecha.auth.authentication.controllers;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.filipwiecha.auth.authentication.Service.AuthService;
import com.filipwiecha.auth.authentication.models.*;
import com.filipwiecha.auth.authentication.utils.RolesToString;
import com.filipwiecha.auth.sessions.models.TokenRequest;
import com.filipwiecha.auth.sessions.models.TokensResponse;
import com.filipwiecha.auth.sessions.services.SessionService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final SessionService sessionService;


    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(
        @Valid @RequestBody LoginRequest credentials,
        HttpServletRequest request, 
        HttpServletResponse response
    ) {
          
        Authentication authentication;
        try {

            authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(credentials.getUsername(), credentials.getPassword())
            );

        } catch (AuthenticationException exception) {
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok()
                .body(
                    this.sessionService.generateNewSession(
                        request,
                        UUID.fromString(authentication.getName()), 
                        RolesToString.toString(authentication)
                    )
                );
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> clearSession(
        @AuthenticationPrincipal Jwt jwt,
        @Valid @RequestBody TokenRequest tokenRequest
    ) {
        if(jwt == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        this.sessionService.logoutSession(tokenRequest.getRefreshToken(), UUID.fromString(jwt.getSubject()));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<Void> createUser(
        @Valid @RequestBody RegisterRequest data, 
        HttpServletRequest request
    ) {
        authService.createUser(data);
        
        return ResponseEntity.ok().build();
    }


    @PostMapping("/refresh")
    public ResponseEntity<TokensResponse> refreshSession(
        @Valid @RequestBody TokenRequest tokenRequest 
    ){
        return ResponseEntity.status(HttpStatus.OK).body(
            this.sessionService.rotateRefreshToken(
                tokenRequest.getRefreshToken()
            )
        );
    }
}

