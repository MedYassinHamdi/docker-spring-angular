package com.example.backenddocker.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItemRequestDTO {
    @NotNull
    private Long productId;

    @NotNull @Min(1)
    private Integer quantity;
}