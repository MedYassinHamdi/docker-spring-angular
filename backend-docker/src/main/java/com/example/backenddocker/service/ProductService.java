package com.example.backenddocker.service;

import com.example.backenddocker.dto.ProductRequestDTO;
import com.example.backenddocker.dto.ProductResponseDTO;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface ProductService {
    ProductResponseDTO create(ProductRequestDTO dto);
    ProductResponseDTO getById(Long id);
    List<ProductResponseDTO> getAll();
    ProductResponseDTO update(Long id, ProductRequestDTO dto);
    void delete(Long id);
    ProductResponseDTO uploadImage(Long id, MultipartFile file);
}