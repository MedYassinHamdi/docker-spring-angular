import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../models/models';

export interface AuthState {
  token: string | null;
  username: string | null;
  email: string | null;
  roles: Role[];
  userId: number | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_KEY = 'auth_user';

  private state = signal<AuthState>(this.loadState());

  readonly currentUser = computed(() => this.state());
  readonly isAuthenticated = computed(() => !!this.state().token);
  readonly isAdmin = computed(() => this.state().roles.includes(Role.ROLE_ADMIN));
  readonly username = computed(() => this.state().username);
  readonly userId = computed(() => this.state().userId);

  private loadState(): AuthState {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const stored = localStorage.getItem(this.USER_KEY);
    if (token && stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { token: null, username: null, email: null, roles: [], userId: null };
      }
    }
    return { token: null, username: null, email: null, roles: [], userId: null };
  }

  saveAuth(token: string, username: string, email: string): void {
    const state: AuthState = { token, username, email, roles: [Role.ROLE_USER], userId: null };
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const authorities: string[] = payload.roles || payload.authorities || [];
      if (authorities.includes('ROLE_ADMIN')) state.roles = [Role.ROLE_USER, Role.ROLE_ADMIN];
      if (payload.sub) state.userId = Number(payload.sub);
    } catch { /* ignore */ }
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(state));
    this.state.set(state);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.state.set({ token: null, username: null, email: null, roles: [], userId: null });
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.state().token;
  }

  getUserId(): number | null {
    return this.state().userId;
  }
}