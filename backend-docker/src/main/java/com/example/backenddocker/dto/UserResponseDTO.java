package com.example.backenddocker.dto;

import com.example.backenddocker.entity.Role;
import lombok.*;
import java.util.Set;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private Set<Role> roles;
}