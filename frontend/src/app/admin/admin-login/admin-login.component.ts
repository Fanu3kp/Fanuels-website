import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ApiError } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { RevealDirective } from '../../shared/reveal/reveal.directive';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RevealDirective],
  template: `
    <div class="admin-login">
      <div class="admin-login__card" appReveal="scale">
        <div class="admin-login__brand">
          <span class="admin-side__mark">FG</span>
          <strong>Otuya Global</strong>
        </div>
        <h1>Sign in</h1>
        <p class="admin-login__sub">Content management panel</p>

        <div class="alert alert--error" *ngIf="error">{{ error }}</div>

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="field">
            <label for="email">Email</label>
            <input id="email" formControlName="email" type="email" autocomplete="username" />
          </div>

          <div class="field">
            <label for="password">Password</label>
            <input id="password" formControlName="password" type="password" autocomplete="current-password" />
          </div>

          <button type="submit" class="btn btn--primary btn--block" [disabled]="sending">
            {{ sending ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  sending = false;
  error = '';

  readonly form = this.fb.nonNullable.group({
    email: ['admin@otuyaelite.com', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.sending = true;
    const { email, password } = this.form.getRawValue();

    this.auth
      .login(email, password)
      .pipe(finalize(() => (this.sending = false)))
      .subscribe({
        next: () => this.router.navigate(['/admin']),
        error: (err: ApiError) => {
          this.error = err.firstError ?? err.message;
        },
      });
  }
}