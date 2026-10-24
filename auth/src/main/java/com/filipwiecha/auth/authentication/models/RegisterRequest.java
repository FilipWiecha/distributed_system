package com.filipwiecha.auth.authentication.models;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.AssertTrue;
import java.nio.charset.StandardCharsets;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.ToString;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    
    @NotBlank(message = "username is required")
    @Size(min = 3, max = 50)
    @Pattern(regexp = "[a-zA-Z0-9_]+")
    private String username;

    @NotBlank(message = "password is required")
    @Size(min = 12, max = 72)
    @ToString.Exclude
    private String password;

    @NotBlank(message = "firstName is required")
    @Size(min = 2, max = 50)
    @Pattern(regexp = "\\p{L}[\\p{L} '-]*")
    private String firstName;

    @NotBlank(message = "lastName is required") 
    @Size(min = 2, max = 50)
    @Pattern(regexp = "\\p{L}[\\p{L} '-]*")
    private String lastName;

    @NotBlank(message = "email is required") 
    @Email
    @Size(max = 255)
    private String email;

    @NotNull(message = "birthDate is required")
    @Past
    private LocalDate birthDate;

    @AssertTrue(message = "Password must not exceed 72 UTF-8 bytes")
    @JsonIgnore
    public boolean isPasswordWithinBcryptLimit() {
        return password == null || password.getBytes(StandardCharsets.UTF_8).length <= 72;
    }
}
