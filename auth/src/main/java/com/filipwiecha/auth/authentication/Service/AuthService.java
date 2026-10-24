package com.filipwiecha.auth.authentication.Service;

import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.filipwiecha.auth.authentication.models.RegisterRequest;
import com.filipwiecha.auth.user.models.User;
import com.filipwiecha.auth.user.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import com.filipwiecha.auth.exceptions.RegistrationConflictException;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void createUser(RegisterRequest registerData){
        
        final String username = registerData.getUsername();
        final String email = registerData.getEmail().strip().toLowerCase(Locale.ROOT);

        if (userRepository.existsByUsernameOrEmail(username, email)) {
            throw new RegistrationConflictException();
        }

        User newUser = new User(registerData);
        newUser.setEmail(email);
        newUser.setPassword(this.passwordEncoder.encode(registerData.getPassword()));

        this.userRepository.saveAndFlush(newUser);
    }
}
