package com.example.backenddocker.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AddressRequestDTO {
    @NotNull
    private Long userId;

    @NotBlank
    private String street;

    @NotBlank
    private String city;

    @NotBlank
    private String postalCode;

    @NotBlank
    private String country;

    private boolean isDefault;
}