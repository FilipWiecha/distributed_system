package com.filipwiecha.auth.user.services;


import java.util.UUID;
import java.nio.charset.StandardCharsets;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.filipwiecha.auth.sessions.services.SessionsForUserService;
import com.filipwiecha.auth.user.models.User;
import com.filipwiecha.auth.user.models.changeData.PasswordDto;
import com.filipwiecha.auth.user.models.confirmDto.ConfirmByPassword;
import com.filipwiecha.auth.user.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SessionsForUserService sessionsForUserService;

    @Transactional(readOnly = true)
    public User getUserByUsernameActive(String username){
        User user = isActive(this.userRepository.findByUsername(username)
            .orElseThrow(() -> new AccessDeniedException("Account unavailable")));

        return user;
    }

    @Transactional(readOnly = true)
    public User getUserByIdActive(UUID userId){
        User user = isActive(this.userRepository.findById(userId)
            .orElseThrow(() -> new AccessDeniedException("Account unavailable")));

        return user;
    }

    @Transactional
    public void changePassword(UUID userId, PasswordDto passwordDto){
        
        if (passwordDto == null || passwordDto.getCurrentPassword() == null
                || passwordDto.getCurrentPassword().isBlank()
                || passwordDto.getCurrentPassword().getBytes(StandardCharsets.UTF_8).length > 72
                || passwordDto.getNewPassword() == null || passwordDto.getNewPassword().isBlank()
                || passwordDto.getNewPassword().length() < 12
                || passwordDto.getNewPassword().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalArgumentException("Invalid password length");
        }
        User user = this.getUserByIdActive(userId);

        String currentHash = user.getPassword();

        if(!this.passwordEncoder.matches(passwordDto.getCurrentPassword(), currentHash)){
            throw new IllegalArgumentException("Password does not match");
        }
        
        int status = this.userRepository.changePassword(
                        this.passwordEncoder.encode(passwordDto.getNewPassword()), 
                        currentHash,
                        userId
                    );

        if(status <= 0){
            throw new IllegalArgumentException("Cant change password");
        }
    }

    @Transactional
    public void deleteUser(UUID userId, ConfirmByPassword confirmByPassword){
        if (confirmByPassword == null || confirmByPassword.getPassword() == null
                || confirmByPassword.getPassword().isBlank()
                || confirmByPassword.getPassword().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalArgumentException("Invalid password");
        }
        User user = this.getUserByIdActive(userId);
        if(!this.passwordEncoder.matches(confirmByPassword.getPassword(), user.getPassword())){
            throw new IllegalArgumentException("Bad password");
        }
        
        this.sessionsForUserService.revokeAll(userId);
        if (this.userRepository.disableUser(userId) != 1) {
            throw new IllegalStateException("Cannot disable account");
        }
    }

    private static User isActive(User user) {
        if (!user.isEnabled() || user.isAccountLocked() || user.isAccountExpired()
                || user.isCredentialsExpired() || user.isTotpEnabled()) {
            throw new AccessDeniedException("Account unavailable");
        }

        return user;
    }

}



