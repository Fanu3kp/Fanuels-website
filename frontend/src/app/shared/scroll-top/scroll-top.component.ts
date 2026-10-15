import { Component, HostListener, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-scroll-top',
  standalone: true,
  imports: [NgIf],
  template: `
    <button
      class="scroll-top"
      *ngIf="visible"
      (click)="scrollToTop()"
      aria-label="Scroll to top"
      title="Back to top"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  `,
  styles: [`
    .scroll-top {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      background: var(--navy-800);
      color: var(--white);
      border: 1px solid var(--navy-700);
      border-radius: 50%;
      cursor: pointer;
      box-shadow: var(--shadow-lg);
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px) scale(0.9);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 40;
    }

    .scroll-top.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
      animation: fadeInUp 0.4s ease-out forwards;
    }

    .scroll-top:hover {
      background: var(--blue-600);
      border-color: var(--blue-500);
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 12px 32px rgba(11, 27, 51, 0.3);
    }

    .scroll-top:active {
      transform: translateY(0) scale(0.95);
    }

    .scroll-top svg {
      transition: transform 0.3s ease;
    }

    .scroll-top:hover svg {
      transform: translateY(-2px);
    }

    @media (max-width: 620px) {
      .scroll-top {
        bottom: 16px;
        right: 16px;
        width: 44px;
        height: 44px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .scroll-top {
        transition: none;
      }
      .scroll-top.visible {
        animation: none;
      }
    }
  `],
})
export class ScrollTopComponent {
  private readonly document = inject(DOCUMENT);
  visible = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollY = this.document.defaultView?.scrollY || 0;
    this.visible = scrollY > 300;
  }

  scrollToTop() {
    this.document.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
  }
}