package com.example.backenddocker.controller;

import com.example.backenddocker.dto.AddressRequestDTO;
import com.example.backenddocker.entity.Address;
import com.example.backenddocker.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @PostMapping
    public Address create(@Valid @RequestBody AddressRequestDTO dto) {
        return addressService.create(dto);
    }

    @GetMapping("/user/{userId}")
    public List<Address> getByUserId(@PathVariable Long userId) {
        return addressService.getByUserId(userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        addressService.delete(id);
        return ResponseEntity.noContent().build();
    }
}