# backend-docker — Full Project Reference

Base package: `com.example.backenddocker`

## Package structure

```
com.example.backenddocker
├── entity
├── repository
├── dto
├── service
├── service.impl
├── controller
└── config
```

---

## 1. Entities (`com.example.backenddocker.entity`)

### Role.java (enum, not a table)

```java
package com.example.backenddocker.entity;

public enum Role {
    ROLE_USER,
    ROLE_ADMIN
}
```

### User.java

```java
package com.example.backenddocker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String fullName;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
```

### Category.java

```java
package com.example.backenddocker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<Product> products = new HashSet<>();
}
```

### Product.java

```java
package com.example.backenddocker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Builder.Default
    private Integer stockQuantity = 0;

    // nullable — image is optional
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
```

### Order.java

```java
package com.example.backenddocker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();

    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum OrderStatus { PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED }
}
```

### OrderItem.java

```java
package com.example.backenddocker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private Integer quantity;

    private BigDecimal unitPrice; // price snapshot at time of order
}
```

### Review.java

```java
package com.example.backenddocker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Integer rating; // 1-5

    @Column(length = 1000)
    private String comment;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
```

### Address.java

```java
package com.example.backenddocker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "addresses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Address {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String street;
    private String city;
    private String postalCode;
    private String country;

    @Builder.Default
    private boolean isDefault = false;
}
```

---

## 2. Repositories (`com.example.backenddocker.repository`)

### UserRepository.java

```java
package com.example.backenddocker.repository;

import com.example.backenddocker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
```

### CategoryRepository.java

```java
package com.example.backenddocker.repository;

import com.example.backenddocker.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {}
```

### ProductRepository.java

```java
package com.example.backenddocker.repository;

import com.example.backenddocker.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
}
```

### OrderRepository.java

```java
package com.example.backenddocker.repository;

import com.example.backenddocker.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
}
```

### OrderItemRepository.java

```java
package com.example.backenddocker.repository;

import com.example.backenddocker.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);
}
```

### ReviewRepository.java

```java
package com.example.backenddocker.repository;

import com.example.backenddocker.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductId(Long productId);
}
```

### AddressRepository.java

```java
package com.example.backenddocker.repository;

import com.example.backenddocker.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserId(Long userId);
}
```

---

## 3. DTOs (`com.example.backenddocker.dto`)

### ProductRequestDTO.java

```java
package com.example.backenddocker.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductRequestDTO {
    @NotBlank
    private String name;

    private String description;

    @NotNull @Positive
    private BigDecimal price;

    @NotNull @Min(0)
    private Integer stockQuantity;

    @NotNull
    private Long categoryId;
}
```

### ProductResponseDTO.java

```java
package com.example.backenddocker.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String imageUrl;
    private String categoryName;
}
```

### UserRequestDTO.java

```java
package com.example.backenddocker.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserRequestDTO {
    @NotBlank
    private String username;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6)
    private String password;

    private String fullName;
}
```

### UserResponseDTO.java

```java
package com.example.backenddocker.dto;

import com.example.backenddocker.entity.Role;
import lombok.*;
import java.util.Set;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private Set<Role> roles;
}
```

### OrderItemRequestDTO.java

```java
package com.example.backenddocker.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItemRequestDTO {
    @NotNull
    private Long productId;

    @NotNull @Min(1)
    private Integer quantity;
}
```

### OrderRequestDTO.java

```java
package com.example.backenddocker.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderRequestDTO {
    @NotNull
    private Long userId;

    @NotEmpty
    private List<OrderItemRequestDTO> items;
}
```

### OrderResponseDTO.java

```java
package com.example.backenddocker.dto;

import com.example.backenddocker.entity.Order;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderResponseDTO {
    private Long id;
    private Long userId;
    private BigDecimal totalAmount;
    private Order.OrderStatus status;
    private List<OrderItemResponseDTO> items;
}
```

### OrderItemResponseDTO.java

```java
package com.example.backenddocker.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItemResponseDTO {
    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
}
```

### ReviewRequestDTO.java

```java
package com.example.backenddocker.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReviewRequestDTO {
    @NotNull
    private Long productId;

    @NotNull
    private Long userId;

    @NotNull @Min(1) @Max(5)
    private Integer rating;

    private String comment;
}
```

### AddressRequestDTO.java

```java
package com.example.backenddocker.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AddressRequestDTO {
    @NotNull
    private Long userId;

    @NotBlank
    private String street;

    @NotBlank
    private String city;

    @NotBlank
    private String postalCode;

    @NotBlank
    private String country;

    private boolean isDefault;
}
```

---

## 4. File storage (image upload)

### FileStorageService.java (`com.example.backenddocker.service`)

```java
package com.example.backenddocker.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String storeFile(MultipartFile file);
    void deleteFile(String filename);
}
```

### FileStorageServiceImpl.java (`com.example.backenddocker.service.impl`)

```java
package com.example.backenddocker.service.impl;

import com.example.backenddocker.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public String storeFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
            String storedFilename = UUID.randomUUID() + extension;

            Path targetLocation = uploadPath.resolve(storedFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return storedFilename;
        } catch (IOException e) {
            throw new RuntimeException("Could not store file: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteFile(String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Could not delete file: " + e.getMessage(), e);
        }
    }
}
```

### WebConfig.java (`com.example.backenddocker.config`)

```java
package com.example.backenddocker.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
```

### application.properties additions

```properties
app.upload.dir=${UPLOAD_DIR:uploads}
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
```

---

## 5. Services (`com.example.backenddocker.service`) + Impl (`com.example.backenddocker.service.impl`)

### UserService.java / UserServiceImpl.java

```java
package com.example.backenddocker.service;

import com.example.backenddocker.dto.UserRequestDTO;
import com.example.backenddocker.dto.UserResponseDTO;
import java.util.List;

public interface UserService {
    UserResponseDTO create(UserRequestDTO dto);
    UserResponseDTO getById(Long id);
    List<UserResponseDTO> getAll();
    UserResponseDTO update(Long id, UserRequestDTO dto);
    void delete(Long id);
}
```

```java
package com.example.backenddocker.service.impl;

import com.example.backenddocker.dto.UserRequestDTO;
import com.example.backenddocker.dto.UserResponseDTO;
import com.example.backenddocker.entity.Role;
import com.example.backenddocker.entity.User;
import com.example.backenddocker.repository.UserRepository;
import com.example.backenddocker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponseDTO create(UserRequestDTO dto) {
        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(dto.getPassword()) // hash later once security is added
                .fullName(dto.getFullName())
                .roles(new HashSet<>(List.of(Role.ROLE_USER)))
                .build();

        return toDTO(userRepository.save(user));
    }

    @Override
    public UserResponseDTO getById(Long id) {
        return toDTO(userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id)));
    }

    @Override
    public List<UserResponseDTO> getAll() {
        return userRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public UserResponseDTO update(Long id, UserRequestDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setFullName(dto.getFullName());

        return toDTO(userRepository.save(user));
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    private UserResponseDTO toDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(user.getRoles())
                .build();
    }
}
```

### CategoryService.java / CategoryServiceImpl.java

```java
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
```

```java
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
```

### ProductService.java / ProductServiceImpl.java

```java
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
```

```java
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
```

### OrderService.java / OrderServiceImpl.java

```java
package com.example.backenddocker.service;

import com.example.backenddocker.dto.OrderRequestDTO;
import com.example.backenddocker.dto.OrderResponseDTO;
import java.util.List;

public interface OrderService {
    OrderResponseDTO create(OrderRequestDTO dto);
    OrderResponseDTO getById(Long id);
    List<OrderResponseDTO> getByUserId(Long userId);
    OrderResponseDTO updateStatus(Long id, String status);
}
```

```java
package com.example.backenddocker.service.impl;

import com.example.backenddocker.dto.*;
import com.example.backenddocker.entity.*;
import com.example.backenddocker.repository.OrderRepository;
import com.example.backenddocker.repository.ProductRepository;
import com.example.backenddocker.repository.UserRepository;
import com.example.backenddocker.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public OrderResponseDTO create(OrderRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getUserId()));

        Order order = Order.builder()
                .user(user)
                .status(Order.OrderStatus.PENDING)
                .build();

        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequestDTO itemDto : dto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemDto.getProductId()));

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemDto.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity())));
            items.add(item);
        }

        order.setOrderItems(items);
        order.setTotalAmount(total);

        return toDTO(orderRepository.save(order));
    }

    @Override
    public OrderResponseDTO getById(Long id) {
        return toDTO(orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id)));
    }

    @Override
    public List<OrderResponseDTO> getByUserId(Long userId) {
        return orderRepository.findByUserId(userId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public OrderResponseDTO updateStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
        order.setStatus(Order.OrderStatus.valueOf(status));
        return toDTO(orderRepository.save(order));
    }

    private OrderResponseDTO toDTO(Order order) {
        List<OrderItemResponseDTO> items = order.getOrderItems().stream()
                .map(i -> OrderItemResponseDTO.builder()
                        .productId(i.getProduct().getId())
                        .productName(i.getProduct().getName())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderResponseDTO.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .items(items)
                .build();
    }
}
```

### ReviewService.java / ReviewServiceImpl.java

```java
package com.example.backenddocker.service;

import com.example.backenddocker.dto.ReviewRequestDTO;
import com.example.backenddocker.entity.Review;
import java.util.List;

public interface ReviewService {
    Review create(ReviewRequestDTO dto);
    List<Review> getByProductId(Long productId);
    void delete(Long id);
}
```

```java
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
```

### AddressService.java / AddressServiceImpl.java

```java
package com.example.backenddocker.service;

import com.example.backenddocker.dto.AddressRequestDTO;
import com.example.backenddocker.entity.Address;
import java.util.List;

public interface AddressService {
    Address create(AddressRequestDTO dto);
    List<Address> getByUserId(Long userId);
    void delete(Long id);
}
```

```java
package com.example.backenddocker.service.impl;

import com.example.backenddocker.dto.AddressRequestDTO;
import com.example.backenddocker.entity.Address;
import com.example.backenddocker.entity.User;
import com.example.backenddocker.repository.AddressRepository;
import com.example.backenddocker.repository.UserRepository;
import com.example.backenddocker.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Override
    public Address create(AddressRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getUserId()));

        Address address = Address.builder()
                .user(user)
                .street(dto.getStreet())
                .city(dto.getCity())
                .postalCode(dto.getPostalCode())
                .country(dto.getCountry())
                .isDefault(dto.isDefault())
                .build();

        return addressRepository.save(address);
    }

    @Override
    public List<Address> getByUserId(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    @Override
    public void delete(Long id) {
        addressRepository.deleteById(id);
    }
}
```

---

## 6. Controllers (`com.example.backenddocker.controller`)

### UserController.java

```java
package com.example.backenddocker.controller;

import com.example.backenddocker.dto.UserRequestDTO;
import com.example.backenddocker.dto.UserResponseDTO;
import com.example.backenddocker.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponseDTO> create(@Valid @RequestBody UserRequestDTO dto) {
        return ResponseEntity.ok(userService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAll() {
        return ResponseEntity.ok(userService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> update(@PathVariable Long id, @Valid @RequestBody UserRequestDTO dto) {
        return ResponseEntity.ok(userService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### CategoryController.java

```java
package com.example.backenddocker.controller;

import com.example.backenddocker.entity.Category;
import com.example.backenddocker.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public Category create(@RequestBody Category category) {
        return categoryService.create(category);
    }

    @GetMapping
    public List<Category> getAll() {
        return categoryService.getAll();
    }

    @GetMapping("/{id}")
    public Category getById(@PathVariable Long id) {
        return categoryService.getById(id);
    }

    @PutMapping("/{id}")
    public Category update(@PathVariable Long id, @RequestBody Category category) {
        return categoryService.update(id, category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### ProductController.java

```java
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
```

### OrderController.java

```java
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
```

### ReviewController.java

```java
package com.example.backenddocker.controller;

import com.example.backenddocker.dto.ReviewRequestDTO;
import com.example.backenddocker.entity.Review;
import com.example.backenddocker.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public Review create(@Valid @RequestBody ReviewRequestDTO dto) {
        return reviewService.create(dto);
    }

    @GetMapping("/product/{productId}")
    public List<Review> getByProductId(@PathVariable Long productId) {
        return reviewService.getByProductId(productId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reviewService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### AddressController.java

```java
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
```

---

## Notes

- `Role` is a plain enum (`ROLE_USER`, `ROLE_ADMIN`), stored on `User` via `@ElementCollection` into a `user_roles` join table — no separate `roles` table/entity needed for this simple case. If you later want role metadata (permissions, descriptions), that's when you'd promote it back to a real entity.
- New users default to `ROLE_USER` on creation. Assigning `ROLE_ADMIN` currently has no endpoint on purpose — add that once security is in, so it isn't an open door.
- Passwords are stored as plain text for now (`user.getPassword()` saved as-is) — this gets replaced with proper hashing (`BCryptPasswordEncoder`) once you add Spring Security.
- `Category`/`Address`/`Review` controllers work directly with entities instead of DTOs to keep things shorter for this learning project — `Product`/`User`/`Order` use DTOs since those are the ones with more complex mapping (image URLs, nested items, category names).
