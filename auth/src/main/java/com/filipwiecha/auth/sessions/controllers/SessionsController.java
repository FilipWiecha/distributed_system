package com.filipwiecha.auth.sessions.controllers;

import java.util.UUID;

import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.filipwiecha.auth.sessions.models.Sessions;
import com.filipwiecha.auth.sessions.models.SessionsDto;
import com.filipwiecha.auth.sessions.models.SessionsSliceDto;
import com.filipwiecha.auth.sessions.services.SessionsForUserService;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth/sessions")
public class SessionsController {
    
    private final SessionsForUserService sessionsForUserService;

    @GetMapping("")
    public ResponseEntity<?> getSlisedSessions(
        @AuthenticationPrincipal Jwt jwt,
        @RequestParam(name = "page", defaultValue = "0", required = false) int pageNumber
    ){

        Slice<Sessions> sessions = this.sessionsForUserService.getSlicedSessions(UUID.fromString(jwt.getSubject()), pageNumber);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(new SessionsSliceDto(sessions)
        );
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<?> getSession(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable @NotNull UUID sessionId
    ){
        Sessions session = this.sessionsForUserService.getSession(sessionId, UUID.fromString(jwt.getSubject()));

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(new SessionsDto(session)
        );
    }

    @DeleteMapping("")
    public ResponseEntity<?> revokeAllSessions(@AuthenticationPrincipal Jwt jwt){

        this.sessionsForUserService.revokeAll(UUID.fromString(jwt.getSubject()));

        return ResponseEntity
            .status(HttpStatus.OK)
            .build();
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<?> revokeSession(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable @NotNull UUID sessionId
    ){

        this.sessionsForUserService.revokeSession(sessionId, UUID.fromString(jwt.getSubject()));

        return ResponseEntity
            .status(HttpStatus.OK)
            .build();
    }

}
