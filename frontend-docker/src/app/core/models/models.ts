export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: Role[];
}

export enum Role {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN',
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  categoryName: string | null;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderRequest {
  userId: number;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface Review {
  id: number;
  product: { id: number };
  user: { id: number };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewRequest {
  productId: number;
  userId: number;
  rating: number;
  comment: string;
}

export interface Address {
  id: number;
  user: { id: number };
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface AddressRequest {
  userId: number;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
}