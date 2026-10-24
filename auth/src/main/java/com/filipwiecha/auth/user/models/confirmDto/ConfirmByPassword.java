package com.filipwiecha.auth.user.models.confirmDto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;
import jakarta.validation.constraints.Size;
import lombok.NoArgsConstructor;

@Data 
@AllArgsConstructor 
@NoArgsConstructor 
public class ConfirmByPassword {
    
    @NotBlank
    @Size(max = 72)
    @ToString.Exclude
    private String password;
}

