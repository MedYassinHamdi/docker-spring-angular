package com.example.backenddocker.service.impl;

import com.example.backenddocker.entity.Category;
import com.example.backenddocker.repository.CategoryRepository;
import com.example.backenddocker.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public Category create(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found: " + id));
    }

    @Override
    public Category update(Long id, Category category) {
        Category existing = getById(id);
        existing.setName(category.getName());
        existing.setDescription(category.getDescription());
        return categoryRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }
}