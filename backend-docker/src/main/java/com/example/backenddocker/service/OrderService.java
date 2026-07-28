package com.example.backenddocker.service;

import com.example.backenddocker.dto.OrderRequestDTO;
import com.example.backenddocker.dto.OrderResponseDTO;
import java.util.List;

public interface OrderService {
    OrderResponseDTO create(OrderRequestDTO dto);
    OrderResponseDTO getById(Long id);
    List<OrderResponseDTO> getByUserId(Long userId);
    OrderResponseDTO updateStatus(Long id, String status);
}