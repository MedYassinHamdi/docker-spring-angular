package com.example.backenddocker.service.impl;

import com.example.backenddocker.dto.ProductRequestDTO;
import com.example.backenddocker.dto.ProductResponseDTO;
import com.example.backenddocker.entity.Category;
import com.example.backenddocker.entity.Product;
import com.example.backenddocker.repository.CategoryRepository;
import com.example.backenddocker.repository.ProductRepository;
import com.example.backenddocker.service.FileStorageService;
import com.example.backenddocker.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;

    @Override
    public ProductResponseDTO create(ProductRequestDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found: " + dto.getCategoryId()));

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stockQuantity(dto.getStockQuantity())
                .category(category)
                .build();

        return toDTO(productRepository.save(product));
    }

    @Override
    public ProductResponseDTO getById(Long id) {
        return toDTO(productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id)));
    }

    @Override
    public List<ProductResponseDTO> getAll() {
        return productRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public ProductResponseDTO update(Long id, ProductRequestDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found: " + dto.getCategoryId()));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setCategory(category);

        return toDTO(productRepository.save(product));
    }

    @Override
    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public ProductResponseDTO uploadImage(Long id, MultipartFile file) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));

        String storedFilename = fileStorageService.storeFile(file);
        product.setImageUrl("/images/" + storedFilename);

        return toDTO(productRepository.save(product));
    }

    private ProductResponseDTO toDTO(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .imageUrl(product.getImageUrl())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .build();
    }
}