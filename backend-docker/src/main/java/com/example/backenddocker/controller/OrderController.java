package com.example.backenddocker.controller;

import com.example.backenddocker.dto.OrderRequestDTO;
import com.example.backenddocker.dto.OrderResponseDTO;
import com.example.backenddocker.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponseDTO> create(@Valid @RequestBody OrderRequestDTO dto) {
        return ResponseEntity.ok(orderService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponseDTO>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getByUserId(userId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponseDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }
}