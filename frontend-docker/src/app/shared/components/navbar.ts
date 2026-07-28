import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-inner">
        <a routerLink="/" class="logo">STORE</a>
        <div class="nav-links">
          <a routerLink="/products" routerLinkActive="active">Products</a>
          @if (auth.isAuthenticated()) {
            <a routerLink="/orders" routerLinkActive="active">Orders</a>
            <a routerLink="/account" routerLinkActive="active">Account</a>
            @if (auth.isAdmin()) {
              <a routerLink="/admin" routerLinkActive="active">Admin</a>
            }
            <button class="btn-text" (click)="auth.logout()">Logout</button>
          } @else {
            <a routerLink="/login" routerLinkActive="active">Login</a>
            <a routerLink="/register" routerLinkActive="active">Register</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { background: var(--color-bg-nav); border-bottom: 1px solid var(--color-border); position: sticky; top: 0; z-index: 100; }
    .nav-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; height: 56px; }
    .logo { font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; letter-spacing: 0.05em; text-decoration: none; color: var(--color-text); }
    .nav-links { display: flex; align-items: center; gap: 1.5rem; }
    .nav-links a { text-decoration: none; color: var(--color-text-muted); font-size: 0.875rem; font-weight: 500; transition: color 0.15s; }
    .nav-links a:hover, .nav-links a.active { color: var(--color-text); }
    .btn-text { background: none; border: none; cursor: pointer; font-size: 0.875rem; font-weight: 500; color: var(--color-text-muted); padding: 0; transition: color 0.15s; }
    .btn-text:hover { color: var(--color-text); }
  `]
})
export class Navbar {
  protected readonly auth = inject(AuthService);
}