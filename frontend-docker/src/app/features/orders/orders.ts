import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Order } from '../../core/models/models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="orders-page">
      <h1>My Orders</h1>
      @if (orders().length === 0) {
        <p class="empty">No orders yet. <a routerLink="/products">Start shopping</a></p>
      } @else {
        <div class="order-list">
          @for (order of orders(); track order.id) {
            <div class="order-card">
              <div class="order-header">
                <span class="order-id">Order #{{ order.id }}</span>
                <span class="order-status" [class]="order.status.toLowerCase()">{{ order.status }}</span>
                <span class="order-total">\${{ order.totalAmount }}</span>
              </div>
              <div class="order-items">
                @for (item of order.items; track item.productId) {
                  <div class="order-item">
                    <span>{{ item.productName }} × {{ item.quantity }}</span>
                    <span>\${{ item.unitPrice * item.quantity }}</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .orders-page { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem; }
    h1 { font-family: var(--font-heading); font-size: 1.75rem; margin-bottom: 1.5rem; }
    .empty { color: var(--color-text-muted); }
    .order-card { border: 1px solid var(--color-border); border-radius: 8px; margin-bottom: 1rem; overflow: hidden; }
    .order-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--color-bg-muted); font-size: 0.9375rem; }
    .order-id { font-weight: 600; }
    .order-status { font-size: 0.8125rem; font-weight: 500; padding: 0.25rem 0.5rem; border-radius: 4px; }
    .order-status.pending { background: #fef3c7; color: #92400e; }
    .order-status.confirmed { background: #dbeafe; color: #1e40af; }
    .order-status.shipped { background: #e0e7ff; color: #3730a3; }
    .order-status.delivered { background: #d1fae5; color: #065f46; }
    .order-status.cancelled { background: #fee2e2; color: #991b1b; }
    .order-total { font-weight: 600; }
    .order-items { padding: 0.75rem 1rem; }
    .order-item { display: flex; justify-content: space-between; padding: 0.25rem 0; font-size: 0.875rem; color: var(--color-text-muted); }
  `]
})
export class OrdersComponent {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  protected readonly orders = signal<Order[]>([]);

  constructor() {
    const uid = this.auth.getUserId();
    if (uid) this.api.getOrdersByUser(uid).subscribe(o => this.orders.set(o));
  }
}