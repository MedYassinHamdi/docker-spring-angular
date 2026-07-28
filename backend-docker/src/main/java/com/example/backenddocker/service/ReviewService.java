package com.example.backenddocker.service;

import com.example.backenddocker.dto.ReviewRequestDTO;
import com.example.backenddocker.entity.Review;
import java.util.List;

public interface ReviewService {
    Review create(ReviewRequestDTO dto);
    List<Review> getByProductId(Long productId);
    void delete(Long id);
}