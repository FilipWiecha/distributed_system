package com.filipwiecha.auth.authentication.Service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.filipwiecha.auth.user.models.User;
import com.filipwiecha.auth.user.repositories.UserRepository;
import com.filipwiecha.auth.user.services.RedisUserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class AuthDetailService implements UserDetailsService {
    
    private final UserRepository userRepository;
    private final RedisUserService redisUserService;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username){
        User user = this.userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Invalid credentials"));

        this.redisUserService.createUser(user);

        return org.springframework.security.core.userdetails.User.withUsername(user.getId().toString())
            .password(user.getPassword())
            .authorities(user.getAuthorities())
            .accountExpired(user.isAccountExpired())
            .accountLocked(user.isAccountLocked() || user.isTotpEnabled())
            .credentialsExpired(user.isCredentialsExpired())
            .disabled(!user.isEnabled())
            .build();
    }
}
