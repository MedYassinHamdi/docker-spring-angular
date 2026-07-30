package com.example.backenddocker.service.impl;

import com.example.backenddocker.dto.ReviewRequestDTO;
import com.example.backenddocker.entity.Product;
import com.example.backenddocker.entity.Review;
import com.example.backenddocker.entity.User;
import com.example.backenddocker.repository.ProductRepository;
import com.example.backenddocker.repository.ReviewRepository;
import com.example.backenddocker.repository.UserRepository;
import com.example.backenddocker.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public Review create(ReviewRequestDTO dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + dto.getProductId()));
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getUserId()));

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .build();

        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    @Override
    public void delete(Long id) {
        reviewRepository.deleteById(id);
    }
}