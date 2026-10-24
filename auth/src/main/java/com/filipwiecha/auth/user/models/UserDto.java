package com.filipwiecha.auth.user.models;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    
    @NotBlank(message = "Email jest wymagany")
    @Pattern(regexp = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$",
                 message = "Podaj poprawny adres email")
    private String email;


    @NotBlank(message = "Nazwa użytkownika jest wymagana")
    @Size(min = 3, message = "Nazwa użytkownika musi mieć min. 3 znaki")
    @Size(max = 20, message = "Nazwa użytkownika może mieć maks. 20 znaków")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$",
                message = "Dozwolone są tylko litery, cyfry i znak _")
    private String username;
    

    @NotBlank(message = "Imię jest wymagane")
    @Size(min = 2, message = "Imię musi mieć min. 2 znaki")
    @Size(max = 50, message = "Imię może mieć maks. 50 znaków")
    @Pattern(regexp = "^\\p{L}[\\p{L}\\s'-]*$", message = "Imię zawiera niedozwolone znaki")
    private String firstName;


    @NotBlank(message = "Nazwisko jest wymagane")
    @Size(min = 2, message = "Nazwisko musi mieć min. 2 znaki")
    @Size(max = 50, message = "Nazwisko może mieć maks. 50 znaków")
    @Pattern(regexp = "^\\p{L}[\\p{L}\\s'-]*$", message = "Nazwisko zawiera niedozwolone znaki")
    private String lastName;


    @NotNull(message = "Data urodzenia jest wymagana")
    @Past(message = "Data urodzenia nie może być z przyszłości")
    private LocalDate birthDate;

    private boolean isTotpEnabled;

    private String role;


    public UserDto(User user){
        this.username = user.getUsername();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.birthDate = user.getBirthDate();
        this.email = user.getEmail();
        this.role = user.getRoles();
        this.isTotpEnabled = user.isTotpEnabled();
    }

}
