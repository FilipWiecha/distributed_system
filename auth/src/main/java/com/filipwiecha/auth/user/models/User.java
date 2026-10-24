package com.filipwiecha.auth.user.models;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Arrays;
import java.util.UUID;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.filipwiecha.auth.authentication.models.RegisterRequest;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@DynamicUpdate

@Getter
@Setter
@NoArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 50, unique = true)
    private String username;

    @Column(nullable = false, length = 255)
    @JsonIgnore
    private String password;

    @Column(nullable = false, length = 255)
    private String firstName;

    @Column(nullable = false, length = 255)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private LocalDate birthDate;

    @Column(nullable = false)
    private String roles;

    @Column(name = "totp_secret", length = 64)
    @JsonIgnore
    private String totpSecret;

    @Column(name = "is_totp_enabled", nullable = false)
    private boolean isTotpEnabled = false;


    // Relacje

    // UserDetails
    @Column(nullable = false)
    private boolean accountExpired = false;

    @Column(nullable = false)
    private boolean accountLocked = false;

    @Column(nullable = false)
    private boolean credentialsExpired = false;

    @Column(nullable = false)
    private boolean enabled = true;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (roles == null || roles.isBlank()) return java.util.List.of();
        return Arrays.stream(roles.split("[,\\s]+"))
            .filter(role -> !role.isBlank()).distinct()
            .map(SimpleGrantedAuthority::new).toList();
    }

    @Override
    public boolean isAccountNonExpired() { return !accountExpired; }

    @Override
    public boolean isAccountNonLocked() { return !accountLocked; }

    @Override
    public boolean isCredentialsNonExpired() { return !credentialsExpired; }


    public User(UserDto dto) {   
        this.username = dto.getUsername();
        this.firstName = dto.getFirstName();
        this.lastName = dto.getLastName();
        this.email = dto.getEmail();
        this.birthDate = dto.getBirthDate();
        this.setUserDefaults();
    }

    public User(RegisterRequest dto){
        this.username = dto.getUsername();
        this.firstName = dto.getFirstName();
        this.lastName = dto.getLastName();
        this.email = dto.getEmail();
        this.birthDate = dto.getBirthDate();
        this.setUserDefaults();
    }

    private void setUserDefaults(){
        this.roles = "ROLE_USER";
        this.accountExpired = false;
        this.accountLocked = false;
        this.credentialsExpired = false;
        this.enabled = true;
    }

}
