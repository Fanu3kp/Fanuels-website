import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" [class.fullscreen]="fullscreen()" [class.visible]="visible()">
      <div class="loading-spinner">
        <svg class="spinner-ring" viewBox="0 0 64 64">
          <circle
            class="spinner-track"
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="var(--slate-200)"
            stroke-width="4"
          />
          <circle
            class="spinner-progress"
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="url(#loading-gradient)"
            stroke-width="4"
            stroke-linecap="round"
            stroke-dasharray="175.9"
            stroke-dashoffset="0"
            transform="rotate(-90) translate(-64)"
          />
        </svg>
        <defs>
          <linearGradient id="loading-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--pink-500)" />
            <stop offset="50%" stop-color="var(--teal-400)" />
            <stop offset="100%" stop-color="var(--violet-500)" />
          </linearGradient>
        </defs>
        <span class="loading-text" *ngIf="message()">{{ message() }}</span>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      border-radius: var(--radius-lg);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease, visibility 0.2s ease;
      z-index: 50;
    }

    .loading-overlay.fullscreen {
      position: fixed;
      inset: 0;
      background: rgba(11, 27, 51, 0.85);
      backdrop-filter: blur(12px);
      border-radius: 0;
      z-index: 200;
    }

    .loading-overlay.visible {
      opacity: 1;
      visibility: visible;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .spinner-ring {
      width: 56px;
      height: 56px;
      animation: spin 1.2s linear infinite;
    }

    .spinner-progress {
      animation: dash 1.5s ease-in-out infinite;
    }

    .loading-text {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--slate-600);
      text-align: center;
      max-width: 200px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes dash {
      0% { stroke-dasharray: 1, 175.9; stroke-dashoffset: 0; }
      50% { stroke-dasharray: 88, 175.9; stroke-dashoffset: -35; }
      100% { stroke-dasharray: 175.9, 175.9; stroke-dashoffset: -175.9; }
    }
  `]
})
export class LoadingComponent {
  visible = input(false);
  fullscreen = input(false);
  message = input('Loading...');
}