import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" role="region" aria-live="polite" aria-label="Notifications">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast--{{ toast.type }}" [style.animation-delay.ms]="getDelay(toast.id)">
          <div class="toast__icon" aria-hidden="true">
            <svg *ngIf="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <svg *ngIf="toast.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <svg *ngIf="toast.type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <svg *ngIf="toast.type === 'info'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
          <div class="toast__content">
            <strong class="toast__title">{{ toast.title }}</strong>
            <p class="toast__message" *ngIf="toast.message">{{ toast.message }}</p>
          </div>
          <button class="toast__close" (click)="toastService.dismiss(toast.id)" aria-label="Dismiss">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          @if (toast.action) {
            <button class="toast__action" (click)="executeAction(toast)">
              {{ toast.action.label }}
            </button>
          }
          <div class="toast__progress" [style.animation-duration.ms]="toast.duration || 5000"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 420px;
      pointer-events: none;
    }

    .toast {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px 20px;
      border-radius: var(--radius-lg);
      background: var(--white);
      border: 1px solid var(--slate-200);
      box-shadow: var(--shadow-xl);
      animation: toast-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      position: relative;
      overflow: hidden;
    }

    @keyframes toast-enter {
      from {
        opacity: 0;
        transform: translateX(100px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }

    .toast::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
    }

    .toast--success::before { background: var(--teal-500); }
    .toast--error::before { background: var(--pink-600); }
    .toast--warning::before { background: var(--amber-500); }
    .toast--info::before { background: var(--blue-600); }

    .toast__icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toast--success .toast__icon { color: var(--teal-500); }
    .toast--error .toast__icon { color: var(--pink-600); }
    .toast--warning .toast__icon { color: var(--amber-500); }
    .toast--info .toast__icon { color: var(--blue-600); }

    .toast__content {
      flex: 1;
      min-width: 0;
    }

    .toast__title {
      display: block;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--slate-900);
      line-height: 1.3;
    }

    .toast__message {
      margin: 4px 0 0;
      font-size: 0.85rem;
      color: var(--slate-600);
      line-height: 1.5;
    }

    .toast__close {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: var(--radius-sm);
      color: var(--slate-400);
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .toast__close:hover {
      background: var(--slate-100);
      color: var(--slate-700);
    }

    .toast__action {
      padding: 6px 12px;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: var(--radius-sm);
      background: transparent;
      border: 1px solid currentColor;
      color: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .toast--success .toast__action { color: var(--teal-600); border-color: var(--teal-300); }
    .toast--error .toast__action { color: var(--pink-600); border-color: var(--pink-300); }
    .toast--warning .toast__action { color: var(--amber-600); border-color: var(--amber-300); }
    .toast--info .toast__action { color: var(--blue-600); border-color: var(--blue-300); }

    .toast__action:hover {
      background: currentColor;
      color: var(--white);
    }

    .toast__progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: 100%;
      border-radius: 0 0 var(--radius-lg) var(--radius-lg);
      transform-origin: left;
      animation: toast-progress linear forwards;
    }

    .toast--success .toast__progress { background: var(--teal-500); }
    .toast--error .toast__progress { background: var(--pink-600); }
    .toast--warning .toast__progress { background: var(--amber-500); }
    .toast--info .toast__progress { background: var(--blue-600); }

    @keyframes toast-progress {
      from { transform: scaleX(1); }
      to { transform: scaleX(0); }
    }

    @media (max-width: 480px) {
      .toast-container {
        top: 16px;
        right: 16px;
        left: 16px;
        max-width: none;
      }
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  constructor() {
    // Keep reference for change detection
    effect(() => this.toastService.toasts());
  }

  getDelay(id: string): number {
    const index = this.toastService.toasts().findIndex(t => t.id === id);
    return index * 100;
  }

  executeAction(toast: Toast): void {
    toast.action?.callback();
    this.toastService.dismiss(toast.id);
  }
}