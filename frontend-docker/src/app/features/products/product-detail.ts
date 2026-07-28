import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Product, Review } from '../../core/models/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (product(); as p) {
      <div class="detail-page">
        <div class="detail-layout">
          <div class="detail-image">
            @if (p.imageUrl) {
              <img [src]="'http://localhost:8080' + p.imageUrl" alt="{{ p.name }}" />
            } @else {
              <div class="placeholder"></div>
            }
          </div>
          <div class="detail-info">
            <span class="category">{{ p.categoryName }}</span>
            <h1>{{ p.name }}</h1>
            <p class="price">\${{ p.price }}</p>
            <p class="desc">{{ p.description }}</p>
            <p class="stock">{{ p.stockQuantity > 0 ? 'In stock' : 'Out of stock' }}</p>
            @if (auth.isAuthenticated()) {
              <div class="add-form">
                <input type="number" min="1" [value]="quantity" #qtyInput />
                <button class="btn-primary" (click)="addToCart(p.id, qtyInput.value)">Add to cart</button>
              </div>
            }
          </div>
        </div>
        <section class="reviews">
          <h2>Reviews</h2>
          @if (auth.isAuthenticated()) {
            <form (ngSubmit)="submitReview()" class="review-form">
              <select [(ngModel)]="reviewRating" name="rating">
                @for (r of [1,2,3,4,5]; track r) {
                  <option [value]="r">{{ r }}</option>
                }
              </select>
              <input type="text" [(ngModel)]="reviewComment" name="comment" placeholder="Your review…" />
              <button type="submit" class="btn-primary btn-sm">Post</button>
            </form>
          }
          @for (rev of reviews(); track rev.id) {
            <div class="review-card">
              <span class="rev-rating">{{ rev.rating }}/5</span>
              <p>{{ rev.comment }}</p>
            </div>
          } @empty {
            <p class="empty">No reviews yet.</p>
          }
        </section>
      </div>
    } @else {
      <p class="loading">Loading…</p>
    }
  `,
  styles: [`
    .detail-page { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; }
    .detail-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
    .detail-image { aspect-ratio: 1 / 1; overflow: hidden; border-radius: 8px; background: var(--color-bg-muted); }
    .detail-image img { width: 100%; height: 100%; object-fit: cover; }
    .placeholder { width: 100%; height: 100%; }
    .category { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); }
    h1 { font-family: var(--font-heading); font-size: 2rem; margin: 0.25rem 0 1rem; }
    .price { font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; }
    .desc { color: var(--color-text-muted); line-height: 1.6; margin-bottom: 1rem; }
    .stock { font-size: 0.875rem; font-weight: 500; color: var(--color-success); margin-bottom: 1.5rem; }
    .add-form { display: flex; gap: 0.75rem; align-items: center; }
    .add-form input { width: 70px; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 6px; font-size: 0.9375rem; }
    .btn-primary { padding: 0.625rem 1.25rem; background: var(--color-accent); color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.9375rem; transition: opacity 0.15s; }
    .btn-primary:hover { opacity: 0.9; }
    .btn-sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
    .reviews { border-top: 1px solid var(--color-border); padding-top: 2rem; }
    h2 { font-family: var(--font-heading); font-size: 1.25rem; margin-bottom: 1rem; }
    .review-form { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
    .review-form select, .review-form input { padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 6px; font-size: 0.875rem; background: var(--color-bg); color: var(--color-text); }
    .review-form input { flex: 1; }
    .review-card { padding: 1rem 0; border-bottom: 1px solid var(--color-border); }
    .rev-rating { font-weight: 600; font-size: 0.9375rem; }
    .empty, .loading { color: var(--color-text-muted); text-align: center; padding: 3rem 0; }
    @media (max-width: 768px) { .detail-layout { grid-template-columns: 1fr; gap: 1.5rem; } }
  `]
})
export class ProductDetailComponent {
  private readonly api = inject(ApiService);
  protected readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  protected readonly product = signal<Product | null>(null);
  protected readonly reviews = signal<Review[]>([]);
  protected quantity = 1;
  protected reviewRating = 5;
  protected reviewComment = '';

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getProduct(id).subscribe(p => this.product.set(p));
    this.api.getReviewsByProduct(id).subscribe(r => this.reviews.set(r));
  }

  addToCart(productId: number, qty: string): void {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]') as { productId: number; quantity: number }[];
    const existing = cart.find(i => i.productId === productId);
    if (existing) existing.quantity += Number(qty) || 1;
    else cart.push({ productId, quantity: Number(qty) || 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
  }

  submitReview(): void {
    const uid = 0; // will be set properly once auth provides userId
    alert('Review submitted (needs user ID from auth)');
  }
}
