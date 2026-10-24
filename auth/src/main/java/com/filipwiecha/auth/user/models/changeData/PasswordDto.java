package com.filipwiecha.auth.user.models.changeData;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordDto {
    
    @NotBlank
    @Size(max = 72)
    @ToString.Exclude
    private String currentPassword;

    @NotBlank(message = "password is required")
    @Size(min = 12, max = 72)
    @ToString.Exclude
    private String newPassword;
}

