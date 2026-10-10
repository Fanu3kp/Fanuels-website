import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { RevealDirective } from '../reveal/reveal.directive';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RevealDirective],
  template: `
    <section class="newsletter" [class.newsletter--inline]="inline()">
      <div class="container">
        <div class="newsletter__inner" appReveal="up">
          <div class="newsletter__content">
            <div class="newsletter__icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h3>{{ inline() ? 'Stay updated' : 'Get insights delivered to your inbox' }}</h3>
            <p>{{ inline() ? 'Join our newsletter for the latest updates.' : 'No spam, just occasional insights on engineering, cloud, and the business of technology. Unsubscribe anytime.' }}</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()" class="newsletter__form" novalidate>
            <div class="field-wrapper">
              <label for="newsletter-email" class="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                formControlName="email"
                placeholder="Enter your email"
                autocomplete="email"
                [class.ng-invalid]="submitted() && form.get('email')?.invalid"
              />
              <button type="submit" class="btn btn--primary" [disabled]="submitting()">
                {{ submitting() ? 'Subscribing...' : 'Subscribe' }}
              </button>
            </div>

            <div class="alert alert--error" *ngIf="error()" role="alert">{{ error() }}</div>
            <div class="alert alert--success" *ngIf="success()" role="status">{{ success() }}</div>

            <p class="newsletter__consent">
              By subscribing, you agree to our privacy policy and consent to receive updates.
            </p>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .newsletter {
      padding: 64px 0;
      background: var(--slate-50);
      border-top: 1px solid var(--slate-200);
    }

    .newsletter--inline {
      padding: 48px 0;
      background: transparent;
      border-top: none;
    }

    .newsletter__inner {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: center;
    }

    .newsletter__icon {
      width: 56px;
      height: 56px;
      display: grid;
      place-items: center;
      background: var(--blue-50);
      color: var(--blue-600);
      border-radius: var(--radius);
      margin-bottom: 16px;
    }

    .newsletter__content h3 {
      margin: 0 0 8px;
      font-size: clamp(1.35rem, 2.5vw, 1.75rem);
    }

    .newsletter__content p {
      margin: 0;
      color: var(--slate-600);
      font-size: 1rem;
    }

    .newsletter__form {
      background: var(--white);
      border: 1px solid var(--slate-200);
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: var(--shadow-sm);
    }

    .field-wrapper {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }

    .field-wrapper input {
      flex: 1;
      padding: 14px 18px;
      border: 1px solid var(--slate-300);
      border-radius: var(--radius);
      font-size: 1rem;
      font-family: inherit;
      color: var(--slate-900);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .field-wrapper input:focus {
      outline: none;
      border-color: var(--blue-500);
      box-shadow: 0 0 0 3px rgba(232, 92, 157, 0.15);
    }

    .field-wrapper input.ng-invalid {
      border-color: var(--red-600);
    }

    .field-wrapper .btn {
      white-space: nowrap;
      flex-shrink: 0;
    }

    .newsletter__consent {
      margin: 0;
      font-size: 0.78rem;
      color: var(--slate-500);
      text-align: center;
    }

    .newsletter__consent a {
      color: var(--blue-600);
      text-decoration: underline;
    }

    .newsletter__consent a:hover {
      color: var(--blue-700);
    }

    @media (max-width: 768px) {
      .newsletter__inner {
        grid-template-columns: 1fr;
        gap: 24px;
        text-align: center;
      }

      .newsletter__icon {
        margin: 0 auto 16px;
      }

      .field-wrapper {
        flex-direction: column;
      }

      .field-wrapper .btn {
        width: 100%;
      }
    }
  `],
})
export class NewsletterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);

  readonly inline = signal(false);
  submitted = signal(false);
  submitting = signal(false);
  error = signal('');
  success = signal('');

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    consent: [true, Validators.requiredTrue],
  });

  ngOnInit() {
    // Check if already subscribed
    const subscribed = localStorage.getItem('newsletter_subscribed');
    if (subscribed) {
      this.success.set('You are already subscribed!');
    }
  }

  submit(): void {
    this.submitted.set(true);
    this.error.set('');
    this.success.set('');

    if (this.form.invalid) {
      return;
    }

    this.submitting.set(true);

    // Simulate API call
    setTimeout(() => {
      this.submitting.set(false);
      this.success.set('Thanks for subscribing! Check your inbox for confirmation.');
      this.form.reset({ email: '', consent: true });
      this.submitted.set(false);
      localStorage.setItem('newsletter_subscribed', 'true');

      // In real app: this.api.subscribeNewsletter(this.form.value).subscribe(...)
    }, 1000);
  }
}