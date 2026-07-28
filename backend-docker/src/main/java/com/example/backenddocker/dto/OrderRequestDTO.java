package com.example.backenddocker.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderRequestDTO {
    @NotNull
    private Long userId;

    @NotEmpty
    private List<OrderItemRequestDTO> items;
}