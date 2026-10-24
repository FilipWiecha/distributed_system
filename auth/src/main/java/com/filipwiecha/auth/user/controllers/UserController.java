package com.filipwiecha.auth.user.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;
import jakarta.validation.Valid;
import com.filipwiecha.auth.user.services.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.filipwiecha.auth.user.models.User;
import com.filipwiecha.auth.user.models.UserDto;
import com.filipwiecha.auth.user.models.changeData.PasswordDto;
import com.filipwiecha.auth.user.models.confirmDto.ConfirmByPassword;

@RestController
@RequestMapping("/auth/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userssService;
    
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal Jwt jwt){
        User user = userssService.getUserByIdActive(UUID.fromString(jwt.getSubject()));
        return ResponseEntity.ok(new UserDto(user));
    }

    @PostMapping("/password")
    public ResponseEntity<?> changeUserPassword(
        @AuthenticationPrincipal Jwt jwt,
        @Valid @RequestBody PasswordDto passwordDto
    ){
        this.userssService.changePassword(UUID.fromString(jwt.getSubject()), passwordDto);

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<?> deleteAccount(
        @AuthenticationPrincipal Jwt jwt,
        @Valid @RequestBody ConfirmByPassword confirmByPassword
    ){
        this.userssService.deleteUser(
            UUID.fromString(jwt.getSubject()),
            confirmByPassword
        );
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}


