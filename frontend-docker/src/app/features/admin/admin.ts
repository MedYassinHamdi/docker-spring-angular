import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Product, ProductRequest, Category } from '../../core/models/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="admin-page">
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Categories</h2>
        <form (ngSubmit)="addCategory()" class="inline-form">
          <input type="text" [(ngModel)]="catName" name="catName" placeholder="Name" required />
          <input type="text" [(ngModel)]="catDesc" name="catDesc" placeholder="Description" />
          <button type="submit" class="btn-primary btn-sm">Add</button>
        </form>
        @for (cat of categories(); track cat.id) {
          <div class="list-row">
            <span>{{ cat.name }}</span>
            <button class="btn-text" (click)="deleteCat(cat.id)">Delete</button>
          </div>
        }
      </section>

      <section>
        <h2>Products</h2>
        <form (ngSubmit)="addProduct()" class="product-form">
          <input type="text" [(ngModel)]="prodName" name="prodName" placeholder="Name" required />
          <input type="text" [(ngModel)]="prodDesc" name="prodDesc" placeholder="Description" />
          <input type="number" [(ngModel)]="prodPrice" name="prodPrice" placeholder="Price" required />
          <input type="number" [(ngModel)]="prodStock" name="prodStock" placeholder="Stock" required />
          <select [(ngModel)]="prodCatId" name="prodCatId">
            <option value="">Select category</option>
            @for (cat of categories(); track cat.id) {
              <option [value]="cat.id">{{ cat.name }}</option>
            }
          </select>
          <button type="submit" class="btn-primary btn-sm">Add product</button>
        </form>
        <div class="product-table">
          @for (p of products(); track p.id) {
            <div class="table-row">
              <span>{{ p.name }}</span>
              <span>\${{ p.price }}</span>
              <span>{{ p.stockQuantity }} in stock</span>
              <button class="btn-text" (click)="deleteProd(p.id)">Delete</button>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .admin-page { max-width: 1000px; margin: 0 auto; padding: 2rem 1.5rem; }
    h1 { font-family: var(--font-heading); font-size: 1.75rem; margin-bottom: 1.5rem; }
    h2 { font-family: var(--font-heading); font-size: 1.125rem; margin: 2rem 0 0.75rem; }
    .inline-form, .product-form { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
    input, select { padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 6px; font-size: 0.875rem; background: var(--color-bg); color: var(--color-text); }
    .product-form input, .product-form select { flex: 1; min-width: 100px; }
    .btn-primary { padding: 0.5rem 1rem; background: var(--color-accent); color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.875rem; }
    .btn-sm { padding: 0.5rem 1rem; }
    .list-row, .table-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--color-border); font-size: 0.875rem; }
    .btn-text { background: none; border: none; cursor: pointer; color: var(--color-danger); font-size: 0.875rem; padding: 0; }
    section { margin-bottom: 2rem; }
  `]
})
export class AdminComponent {
  private readonly api = inject(ApiService);
  protected readonly products = signal<Product[]>([]);
  protected readonly categories = signal<Category[]>([]);

  protected catName = '';
  protected catDesc = '';
  protected prodName = '';
  protected prodDesc = '';
  protected prodPrice = 0;
  protected prodStock = 0;
  protected prodCatId = 0;

  constructor() {
    this.load();
  }

  private load(): void {
    this.api.getProducts().subscribe(p => this.products.set(p));
    this.api.getCategories().subscribe(c => this.categories.set(c));
  }

  addCategory(): void {
    this.api.createCategory({ id: 0, name: this.catName, description: this.catDesc }).subscribe(() => {
      this.catName = ''; this.catDesc = ''; this.load();
    });
  }

  deleteCat(id: number): void {
    this.api.deleteCategory(id).subscribe(() => this.load());
  }

  addProduct(): void {
    const data: ProductRequest = { name: this.prodName, description: this.prodDesc, price: this.prodPrice, stockQuantity: this.prodStock, categoryId: this.prodCatId };
    this.api.createProduct(data).subscribe(() => {
      this.prodName = ''; this.prodDesc = ''; this.prodPrice = 0; this.prodStock = 0; this.prodCatId = 0;
      this.load();
    });
  }

  deleteProd(id: number): void {
    this.api.deleteProduct(id).subscribe(() => this.load());
  }
}