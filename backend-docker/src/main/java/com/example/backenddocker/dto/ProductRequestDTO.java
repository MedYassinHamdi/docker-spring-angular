package com.example.backenddocker.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductRequestDTO {
    @NotBlank
    private String name;

    private String description;

    @NotNull @Positive
    private BigDecimal price;

    @NotNull @Min(0)
    private Integer stockQuantity;

    @NotNull
    private Long categoryId;
}