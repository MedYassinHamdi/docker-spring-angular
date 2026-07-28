package com.example.backenddocker.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserRequestDTO {
    @NotBlank
    private String username;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6)
    private String password;

    private String fullName;
}