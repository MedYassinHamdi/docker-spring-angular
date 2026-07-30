package com.example.backenddocker.service.impl;

import com.example.backenddocker.dto.ProductRequestDTO;
import com.example.backenddocker.dto.ProductResponseDTO;
import com.example.backenddocker.entity.Category;
import com.example.backenddocker.entity.Product;
import com.example.backenddocker.repository.CategoryRepository;
import com.example.backenddocker.repository.ProductRepository;
import com.example.backenddocker.service.FileStorageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    void shouldCreateProductWhenCategoryExists() {
        // Given
        Long categoryId = 1L;
        Category category = Category.builder().id(categoryId).name("Electronics").build();

        ProductRequestDTO dto = new ProductRequestDTO();
        dto.setName("Laptop");
        dto.setDescription("Gaming laptop");
        dto.setPrice(new BigDecimal("999.99"));
        dto.setStockQuantity(10);
        dto.setCategoryId(categoryId);

        Product savedProduct = Product.builder()
                .id(1L)
                .name("Laptop")
                .description("Gaming laptop")
                .price(new BigDecimal("999.99"))
                .stockQuantity(10)
                .category(category)
                .build();

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        // When
        ProductResponseDTO result = productService.create(dto);

        // Then
        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        assertEquals(new BigDecimal("999.99"), result.getPrice());
        assertEquals("Electronics", result.getCategoryName());

        verify(categoryRepository).findById(categoryId);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void shouldThrowExceptionWhenCategoryNotFoundDuringCreate() {
        // Given
        Long nonExistentCategoryId = 99L;
        ProductRequestDTO dto = new ProductRequestDTO();
        dto.setName("Mystery Product");
        dto.setDescription("No category");
        dto.setPrice(new BigDecimal("49.99"));
        dto.setStockQuantity(5);
        dto.setCategoryId(nonExistentCategoryId);

        when(categoryRepository.findById(nonExistentCategoryId)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> productService.create(dto));
        assertTrue(exception.getMessage().contains("Category not found"));
        verify(categoryRepository).findById(nonExistentCategoryId);
        verify(productRepository, never()).save(any());
    }

    @Test
    void shouldThrowExceptionWhenGetByIdProductNotFound() {
        // Given
        Long nonExistentId = 404L;
        when(productRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> productService.getById(nonExistentId));
        assertTrue(exception.getMessage().contains("Product not found"));
        verify(productRepository).findById(nonExistentId);
    }
}