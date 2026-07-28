import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Product, ProductRequest, Category, Order, OrderRequest,
  Review, ReviewRequest, Address, AddressRequest,
  RegisterRequest, LoginRequest, AuthResponse,
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:8080/api';

  // Auth
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/register`, data);
  }
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/login`, data);
  }

  // Products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/products`);
  }
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/products/${id}`);
  }
  createProduct(data: ProductRequest): Observable<Product> {
    return this.http.post<Product>(`${this.base}/products`, data);
  }
  updateProduct(id: number, data: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.base}/products/${id}`, data);
  }
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/products/${id}`);
  }
  uploadProductImage(id: number, file: File): Observable<Product> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<Product>(`${this.base}/products/${id}/image`, fd);
  }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/categories`);
  }
  createCategory(data: Category): Observable<Category> {
    return this.http.post<Category>(`${this.base}/categories`, data);
  }
  updateCategory(id: number, data: Category): Observable<Category> {
    return this.http.put<Category>(`${this.base}/categories/${id}`, data);
  }
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/categories/${id}`);
  }

  // Orders
  createOrder(data: OrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.base}/orders`, data);
  }
  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.base}/orders/${id}`);
  }
  getOrdersByUser(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base}/orders/user/${userId}`);
  }
  updateOrderStatus(id: number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.base}/orders/${id}/status?status=${status}`, {});
  }

  // Reviews
  createReview(data: ReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${this.base}/reviews`, data);
  }
  getReviewsByProduct(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.base}/reviews/product/${productId}`);
  }
  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/reviews/${id}`);
  }

  // Addresses
  createAddress(data: AddressRequest): Observable<Address> {
    return this.http.post<Address>(`${this.base}/addresses`, data);
  }
  getAddressesByUser(userId: number): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.base}/addresses/user/${userId}`);
  }
  deleteAddress(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/addresses/${id}`);
  }
}