package com.filipwiecha.gateway;

import java.time.Duration;
import java.util.Arrays;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


public class CorsConfig {
    
    public UrlBasedCorsConfigurationSource apiConfig(){
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowedOrigins(Arrays.asList("http://account.mojprojekt.test", "http://gym.mojprojekt.test"));
        cors.addAllowedHeader("*");
        cors.setAllowedMethods(Arrays.asList("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        cors.setAllowCredentials(true);
        cors.setMaxAge(Duration.ofDays(1));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cors);

        return source;
    }
}
