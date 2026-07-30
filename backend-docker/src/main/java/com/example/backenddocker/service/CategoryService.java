package com.example.backenddocker.service;

import com.example.backenddocker.entity.Category;
import java.util.List;

public interface CategoryService {
    Category create(Category category);
    List<Category> getAll();
    Category getById(Long id);
    Category update(Long id, Category category);
    void delete(Long id);
}