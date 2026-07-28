import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Product, Category } from '../../core/models/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="catalog-page">
      <div class="catalog-header">
        <h1>Products</h1>
        <div class="filters">
          <select (change)="onCategoryChange($event)">
            <option value="">All categories</option>
            @for (cat of categories(); track cat.id) {
              <option [value]="cat.id" [selected]="selectedCategory() === cat.id">{{ cat.name }}</option>
            }
          </select>
          <input type="text" placeholder="Search…" (input)="onSearch($event)" />
        </div>
      </div>
      <div class="product-grid">
        @for (product of filteredProducts(); track product.id) {
          <a [routerLink]="['/products', product.id]" class="product-card">
            <div class="card-image">
              @if (product.imageUrl) {
                <img [src]="'http://localhost:8080' + product.imageUrl" alt="{{ product.name }}" />
              } @else {
                <div class="placeholder"></div>
              }
            </div>
            <div class="card-body">
              <span class="card-category">{{ product.categoryName }}</span>
              <h3>{{ product.name }}</h3>
              <p class="card-price">\${{ product.price }}</p>
            </div>
          </a>
        } @empty {
          <p class="empty">No products found.</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .catalog-page { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; }
    .catalog-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; }
    h1 { font-family: var(--font-heading); font-size: 1.75rem; }
    .filters { display: flex; gap: 0.75rem; }
    select, input { padding: 0.5rem 0.75rem; border: 1px solid var(--color-border); border-radius: 6px; font-size: 0.875rem; background: var(--color-bg); color: var(--color-text); }
    select:focus, input:focus { outline: none; border-color: var(--color-accent); }
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; }
    .product-card { text-decoration: none; color: inherit; border: 1px solid var(--color-border); border-radius: 8px; overflow: hidden; transition: box-shadow 0.2s; }
    .product-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .card-image { aspect-ratio: 1 / 1; overflow: hidden; background: var(--color-bg-muted); }
    .card-image img { width: 100%; height: 100%; object-fit: cover; }
    .placeholder { width: 100%; height: 100%; }
    .card-body { padding: 1rem; }
    .card-category { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); }
    h3 { font-size: 1rem; font-weight: 500; margin: 0.25rem 0 0.5rem; }
    .card-price { font-weight: 600; font-size: 1.125rem; }
    .empty { grid-column: 1 / -1; text-align: center; color: var(--color-text-muted); padding: 4rem 0; }
  `]
})
export class ProductListComponent {
  private readonly api = inject(ApiService);
  protected readonly products = signal<Product[]>([]);
  protected readonly categories = signal<Category[]>([]);
  protected readonly selectedCategory = signal<number | null>(null);
  protected readonly searchQuery = signal('');

  protected filteredProducts = () => {
    let list = this.products();
    const cat = this.selectedCategory();
    if (cat) list = list.filter(p => p.categoryName === this.categories().find(c => c.id === cat)?.name);
    const q = this.searchQuery().toLowerCase();
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q));
    return list;
  };

  constructor() {
    this.api.getProducts().subscribe(p => this.products.set(p));
    this.api.getCategories().subscribe(c => this.categories.set(c));
  }

  protected onCategoryChange(e: Event): void {
    const val = (e.target as HTMLSelectElement).value;
    this.selectedCategory.set(val ? Number(val) : null);
  }

  protected onSearch(e: Event): void {
    this.searchQuery.set((e.target as HTMLInputElement).value);
  }
}