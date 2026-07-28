package com.example.backenddocker.controller;

import com.example.backenddocker.dto.ProductRequestDTO;
import com.example.backenddocker.dto.ProductResponseDTO;
import com.example.backenddocker.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponseDTO> create(@Valid @RequestBody ProductRequestDTO dto) {
        return ResponseEntity.ok(productService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAll() {
        return ResponseEntity.ok(productService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> update(@PathVariable Long id, @Valid @RequestBody ProductRequestDTO dto) {
        return ResponseEntity.ok(productService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // image is optional — separate endpoint, not required at product creation
    @PostMapping("/{id}/image")
    public ResponseEntity<ProductResponseDTO> uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(productService.uploadImage(id, file));
    }
}