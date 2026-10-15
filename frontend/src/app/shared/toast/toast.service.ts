import { Injectable, signal, computed, inject } from '@angular/core';
import { NgZone } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  action?: { label: string; callback: () => void };
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly zone = inject(NgZone);
  private readonly _toasts = signal<Toast[]>([]);

  readonly toasts = this._toasts.asReadonly();

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }

  show(toast: Omit<Toast, 'id'>): string {
    const id = this.generateId();
    const newToast: Toast = { ...toast, id, duration: toast.duration ?? 5000 };

    this.zone.run(() => {
      this._toasts.update((t) => [...t, newToast]);
    });

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => this.dismiss(id), newToast.duration);
    }

    return id;
  }

  success(title: string, message?: string, duration?: number): string {
    return this.show({ type: 'success', title, message, duration });
  }

  error(title: string, message?: string, duration?: number): string {
    return this.show({ type: 'error', title, message, duration: duration ?? 7000 });
  }

  info(title: string, message?: string, duration?: number): string {
    return this.show({ type: 'info', title, message, duration });
  }

  warning(title: string, message?: string, duration?: number): string {
    return this.show({ type: 'warning', title, message, duration });
  }

  dismiss(id: string): void {
    this.zone.run(() => {
      this._toasts.update((t) => t.filter((toast) => toast.id !== id));
    });
  }

  clear(): void {
    this.zone.run(() => {
      this._toasts.set([]);
    });
  }
}