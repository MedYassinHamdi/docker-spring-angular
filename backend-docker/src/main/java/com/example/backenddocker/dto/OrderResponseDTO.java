package com.example.backenddocker.dto;

import com.example.backenddocker.entity.Order;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderResponseDTO {
    private Long id;
    private Long userId;
    private BigDecimal totalAmount;
    private Order.OrderStatus status;
    private List<OrderItemResponseDTO> items;
}