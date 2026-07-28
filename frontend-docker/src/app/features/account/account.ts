import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Address } from '../../core/models/models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="account-page">
      <h1>Account</h1>
      <section>
        <h2>Profile</h2>
        <p>Username: <strong>{{ auth.username() }}</strong></p>
      </section>
      <section>
        <h2>Addresses</h2>
        @for (addr of addresses(); track addr.id) {
          <div class="address-card">
            <p>{{ addr.street }}, {{ addr.city }}, {{ addr.postalCode }}, {{ addr.country }}</p>
            <button class="btn-text" (click)="deleteAddr(addr.id)">Delete</button>
          </div>
        } @empty {
          <p class="empty">No addresses saved.</p>
        }
        <form (ngSubmit)="addAddress()" class="addr-form">
          <input type="text" [(ngModel)]="newStreet" name="street" placeholder="Street" required />
          <input type="text" [(ngModel)]="newCity" name="city" placeholder="City" required />
          <input type="text" [(ngModel)]="newPostal" name="postal" placeholder="Postal code" required />
          <input type="text" [(ngModel)]="newCountry" name="country" placeholder="Country" required />
          <button type="submit" class="btn-primary btn-sm">Save</button>
        </form>
      </section>
    </div>
  `,
  styles: [`
    .account-page { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem; }
    h1 { font-family: var(--font-heading); font-size: 1.75rem; margin-bottom: 1.5rem; }
    h2 { font-family: var(--font-heading); font-size: 1.125rem; margin: 1.5rem 0 0.75rem; }
    .address-card { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--color-border); }
    .btn-text { background: none; border: none; cursor: pointer; color: var(--color-danger); font-size: 0.875rem; padding: 0; }
    .empty { color: var(--color-text-muted); font-size: 0.875rem; }
    .addr-form { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
    .addr-form input { flex: 1; min-width: 120px; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 6px; font-size: 0.875rem; background: var(--color-bg); color: var(--color-text); }
    .btn-primary { padding: 0.5rem 1rem; background: var(--color-accent); color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.875rem; transition: opacity 0.15s; }
    .btn-primary:hover { opacity: 0.9; }
    .btn-sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
  `]
})
export class AccountComponent {
  private readonly api = inject(ApiService);
  protected readonly auth = inject(AuthService);
  protected readonly addresses = signal<Address[]>([]);
  protected newStreet = '';
  protected newCity = '';
  protected newPostal = '';
  protected newCountry = '';

  constructor() {
    const uid = this.auth.getUserId();
    if (uid) this.api.getAddressesByUser(uid).subscribe(a => this.addresses.set(a));
  }

  addAddress(): void {
    const uid = this.auth.getUserId() ?? 1;
    this.api.createAddress({ userId: uid, street: this.newStreet, city: this.newCity, postalCode: this.newPostal, country: this.newCountry, isDefault: false }).subscribe(a => {
      this.addresses.update(list => [...list, a]);
      this.newStreet = ''; this.newCity = ''; this.newPostal = ''; this.newCountry = '';
    });
  }

  deleteAddr(id: number): void {
    this.api.deleteAddress(id).subscribe(() => this.addresses.update(list => list.filter(a => a.id !== id)));
  }
}