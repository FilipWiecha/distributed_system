package com.filipwiecha.auth.sessions.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenRequest {
    
    @jakarta.validation.constraints.NotBlank
    @jakarta.validation.constraints.Size(max = 256)
    private String refreshToken;
}

