import { Injectable } from '@angular/core';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const REFRESH_KEY = 'auth-refresh';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}
  onLogout(): void {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  saveRefreshToken(refreshToken: string): void {
    localStorage.removeItem(REFRESH_KEY);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  }

  removeRefreshToken(): void {
    localStorage.removeItem(REFRESH_KEY);
  }

  getUser(): any {
    const user = localStorage.getItem(USER_KEY);
    if (user) return JSON.parse(user);
    return {};
  }

  saveUser(token: string): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(token));
  }

  removeUser(): void {
    localStorage.removeItem(USER_KEY);
  }
}
