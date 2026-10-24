package com.filipwiecha.auth.authentication.utils;

import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;

public class RolesToString {
    
    /**
        Remove FACTOR_PASSSWORD from authorities (Spring add it in spring security 7)
    **/
    public static String toString(Authentication auth){
        return auth.getAuthorities().stream()
            .map(a->{return a.getAuthority();})
            .filter(authority -> authority.startsWith("ROLE_"))
            .collect(Collectors.joining(", ", "[", "]"));
    }
}
