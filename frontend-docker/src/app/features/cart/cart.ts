import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/models';

interface CartItem { productId: number; quantity: number; }

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="cart-page">
      <h1>Cart</h1>
      @if (items().length === 0) {
        <p class="empty">Your cart is empty. <a routerLink="/products">Browse products</a></p>
      } @else {
        <div class="cart-list">
          @for (item of items(); track item.productId) {
            <div class="cart-row">
              <span>{{ productMap()[item.productId]?.name || 'Product' }}</span>
              <span>Qty: {{ item.quantity }}</span>
              <span>\${{ (productMap()[item.productId]?.price || 0) * item.quantity }}</span>
              <button class="btn-text" (click)="remove(item.productId)">Remove</button>
            </div>
          }
        </div>
        <p class="total">Total: \${{ total() }}</p>
        @if (auth.isAuthenticated()) {
          <button class="btn-primary" (click)="checkout()">Place order</button>
        } @else {
          <p><a routerLink="/login">Sign in</a> to place an order.</p>
        }
      }
    </div>
  `,
  styles: [`
    .cart-page { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem; }
    h1 { font-family: var(--font-heading); font-size: 1.75rem; margin-bottom: 1.5rem; }
    .empty { color: var(--color-text-muted); }
    .cart-list { border-top: 1px solid var(--color-border); }
    .cart-row { display: flex; align-items: center; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid var(--color-border); }
    .btn-text { background: none; border: none; cursor: pointer; color: var(--color-danger); font-size: 0.875rem; padding: 0; }
    .total { font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0; }
    .btn-primary { padding: 0.75rem 2rem; background: var(--color-accent); color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.9375rem; transition: opacity 0.15s; }
    .btn-primary:hover { opacity: 0.9; }
  `]
})
export class CartComponent {
  private readonly api = inject(ApiService);
  protected readonly auth = inject(AuthService);
  protected readonly items = signal<CartItem[]>([]);
  protected readonly productMap = signal<Record<number, Product>>({});

  protected total = () => this.items().reduce((sum, i) => sum + (this.productMap()[i.productId]?.price || 0) * i.quantity, 0);

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const raw = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];
    this.items.set(raw);
    const ids = [...new Set(raw.map(i => i.productId))];
    ids.forEach(id => this.api.getProduct(id).subscribe(p => {
      this.productMap.update(m => ({ ...m, [id]: p }));
    }));
  }

  remove(productId: number): void {
    const updated = this.items().filter(i => i.productId !== productId);
    this.items.set(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  }

  checkout(): void {
    const userId = this.auth.getUserId() ?? 1;
    const items = this.items().map(i => ({ productId: i.productId, quantity: i.quantity }));
    this.api.createOrder({ userId, items }).subscribe({
      next: () => {
        localStorage.removeItem('cart');
        this.items.set([]);
        alert('Order placed!');
      },
      error: () => alert('Order failed. Make sure you are logged in.'),
    });
  }
}