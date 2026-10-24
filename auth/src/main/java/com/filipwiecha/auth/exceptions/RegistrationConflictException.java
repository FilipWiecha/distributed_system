package com.filipwiecha.auth.exceptions;

public class RegistrationConflictException extends RuntimeException {
    public RegistrationConflictException() {
        super("Nie można zarejestrować konta z podanymi danymi.");
    }
}
