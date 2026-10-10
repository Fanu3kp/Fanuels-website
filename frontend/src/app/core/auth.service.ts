import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AdminUser } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly userSignal = signal<AdminUser | null>(null);

  readonly user = this.userSignal.asReadonly();
  readonly isAdmin = computed(() => this.userSignal()?.role === 'admin');

  get isAuthenticated(): boolean {
    return this.api.getToken() !== null;
  }

  login(email: string, password: string): Observable<AdminUser> {
    return this.api.login(email, password).pipe(tap((user) => this.userSignal.set(user)));
  }

  restore(): Observable<AdminUser | null> {
    if (!this.isAuthenticated) {
      return of(null);
    }

    return this.api.me().pipe(tap((user) => this.userSignal.set(user)));
  }

  logout(): void {
    this.api
      .logout()
      .subscribe(() => {
        this.userSignal.set(null);
        this.router.navigate(['/admin/login']);
      });
  }
}