import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1>Create account</h1>
        <form (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="username">Username</label>
            <input id="username" type="text" [(ngModel)]="username" name="username" required />
          </div>
          <div class="field">
            <label for="email">Email</label>
            <input id="email" type="email" [(ngModel)]="email" name="email" required />
          </div>
          <div class="field">
            <label for="fullName">Full name</label>
            <input id="fullName" type="text" [(ngModel)]="fullName" name="fullName" />
          </div>
          <div class="field">
            <label for="password">Password</label>
            <input id="password" type="password" [(ngModel)]="password" name="password" required />
          </div>
          @if (error()) {
            <p class="error">{{ error() }}</p>
          }
          <button type="submit" class="btn-primary" [disabled]="loading()">
            {{ loading() ? 'Creating…' : 'Register' }}
          </button>
        </form>
        <p class="alt">Already have an account? <a routerLink="/login">Sign in</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 56px); padding: 2rem; }
    .auth-card { width: 100%; max-width: 400px; }
    h1 { font-family: var(--font-heading); font-size: 1.75rem; margin-bottom: 1.5rem; }
    .field { margin-bottom: 1rem; }
    label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--color-text-muted); }
    input { width: 100%; padding: 0.625rem 0.75rem; border: 1px solid var(--color-border); border-radius: 6px; font-size: 0.9375rem; background: var(--color-bg); color: var(--color-text); }
    input:focus { outline: none; border-color: var(--color-accent); }
    .btn-primary { width: 100%; padding: 0.75rem; background: var(--color-accent); color: #fff; border: none; border-radius: 6px; font-size: 0.9375rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s; margin-top: 0.5rem; }
    .btn-primary:disabled { opacity: 0.5; }
    .btn-primary:hover:not(:disabled) { opacity: 0.9; }
    .error { color: var(--color-danger); font-size: 0.875rem; margin-top: 0.5rem; }
    .alt { text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--color-text-muted); }
    .alt a { color: var(--color-accent); text-decoration: none; }
  `]
})
export class RegisterComponent {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected username = '';
  protected email = '';
  protected fullName = '';
  protected password = '';
  protected loading = signal(false);
  protected error = signal('');

  onSubmit(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.register({ username: this.username, email: this.email, password: this.password, fullName: this.fullName }).subscribe({
      next: (res) => {
        this.auth.saveAuth(res.token, res.username, res.email);
        this.router.navigate(['/products']);
      },
      error: () => {
        this.error.set('Registration failed. Try a different username or email.');
        this.loading.set(false);
      },
    });
  }
}