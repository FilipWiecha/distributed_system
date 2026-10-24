package com.filipwiecha.auth.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import com.filipwiecha.auth.authentication.Service.AuthDetailService;

import lombok.AllArgsConstructor;



@Configuration
@EnableWebSecurity
@AllArgsConstructor 
public class SecurityConfig {

    private final JwtDecoder jwtDecoder;
    private final JwtAuthenticationConverter jwtAuthenticationConverter;

    @Bean
    public SecurityFilterChain authFilterChain(
        HttpSecurity http
    ) {

        return http

            .authorizeHttpRequests(r -> r
                .requestMatchers("/auth/register", "/auth/login", "/auth/refresh", "/auth/logout").permitAll()
                .requestMatchers("/auth/**").authenticated()
                .anyRequest().denyAll())

            .sessionManagement(s-> s
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .oauth2ResourceServer(r-> r
                .jwt(t-> t
                    .decoder(jwtDecoder)
                    .jwtAuthenticationConverter(jwtAuthenticationConverter)
                )
            )

            // TO DO: cors and csrf
            .csrf(c -> c.disable())
            .cors(c -> c.disable())

            .build();
    }

    // Hashowanie haseł
    @Bean
    public PasswordEncoder passwordEncoder() { 
        return new BCryptPasswordEncoder(12); 
    }

    // Przekazanie AuthProvidera (Dao -> login i hasło) do AuthMenagera z naszym "Custom" Details service i wybranym password encoderem; 
    @Bean
    public AuthenticationManager authenticationManager(AuthDetailService uDetailService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(uDetailService);
        authProvider.setPasswordEncoder(passwordEncoder);

        ProviderManager providerManager = new ProviderManager(authProvider);
        
        return providerManager;
    }

}
