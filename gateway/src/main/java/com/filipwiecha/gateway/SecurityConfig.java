package com.filipwiecha.gateway;

import org.springframework.cloud.gateway.server.mvc.filter.SimpleFilterSupplier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CorsConfig corsConfig = new CorsConfig();

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http){
        http
            .authorizeHttpRequests(a->a
                .anyRequest().permitAll()
            )
            .csrf(c->c.disable())
            .cors(c->c.configurationSource(corsConfig.apiConfig()))
            .sessionManagement(s->s.disable());
            
            

        return http.build();
    }

    @Bean
    public SimpleFilterSupplier clientTokenFilterSupplier() {
        return new SimpleFilterSupplier(ClientTokenFilters.class);
    }
}
