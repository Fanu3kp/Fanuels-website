import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, Observable, throttleTime, map, distinctUntilChanged } from 'rxjs';

export interface ScrollPosition {
  y: number;
  progress: number;
  direction: 'up' | 'down' | 'none';
  velocity: number;
}

export interface ElementScrollData {
  element: HTMLElement;
  top: number;
  bottom: number;
  height: number;
  progress: number;
  isVisible: boolean;
  wasVisible: boolean;
}

@Injectable({ providedIn: 'root' })
export class ScrollAnimationService {
  private readonly doc = inject(DOCUMENT);
  private readonly win = this.doc.defaultView;

  readonly scrollPosition = signal<ScrollPosition>({
    y: 0,
    progress: 0,
    direction: 'none',
    velocity: 0,
  });

  readonly elementsInView = signal<ElementScrollData[]>([]);
  readonly prefersReducedMotion = signal(false);
  readonly initialUpdateComplete = signal(false);

  private lastY = 0;
  private lastTime = 0;
  private animationFrame = 0;
  private observer?: IntersectionObserver;
  private observedElements = new Map<HTMLElement, ElementScrollData>();

  constructor() {
    this.initScrollListener();
    this.initResizeListener();
    this.checkReducedMotion();
    // Run initial update synchronously
    this.updateElementPositions();
    this.initialUpdateComplete.set(true);
  }

  private initScrollListener(): void {
    if (!this.win) return;

    fromEvent(this.win, 'scroll', { passive: true })
      .pipe(
        throttleTime(16),
        map(() => this.calculateScrollPosition()),
        distinctUntilChanged((a, b) => a.y === b.y && a.direction === b.direction)
      )
      .subscribe((pos) => this.scrollPosition.set(pos));

    this.animationFrame = this.win.requestAnimationFrame(() => this.updateElementPositions());
  }

  private initResizeListener(): void {
    if (!this.win) return;
    fromEvent(this.win, 'resize')
      .pipe(throttleTime(100))
      .subscribe(() => this.updateElementPositions());
  }

  private checkReducedMotion(): void {
    if (!this.win) return;
    this.prefersReducedMotion.set(
      this.win.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  private calculateScrollPosition(): ScrollPosition {
    if (!this.win || !this.doc.documentElement) {
      return { y: 0, progress: 0, direction: 'none', velocity: 0 };
    }

    const y = this.win.scrollY;
    const maxScroll = this.doc.documentElement.scrollHeight - this.win.innerHeight;
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0;
    const direction = y > this.lastY ? 'down' : y < this.lastY ? 'up' : 'none';

    const now = performance.now();
    const velocity = now !== this.lastTime ? Math.abs(y - this.lastY) / (now - this.lastTime) : 0;

    this.lastY = y;
    this.lastTime = now;

    return { y, progress, direction, velocity };
  }

  private updateElementPositions(): void {
    if (!this.win || this.prefersReducedMotion()) return;

    const elements: ElementScrollData[] = [];
    const viewportHeight = this.win.innerHeight;

    this.observedElements.forEach((data, element) => {
      const rect = element.getBoundingClientRect();
      const top = rect.top + this.win!.scrollY;
      const bottom = rect.bottom + this.win!.scrollY;
      const height = rect.height;
      const centerY = (rect.top + rect.bottom) / 2;

      const isVisible = rect.top < viewportHeight && rect.bottom > 0;
      const progress = height > 0
        ? Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight + height)))
        : 0;

      elements.push({
        element,
        top,
        bottom,
        height,
        progress,
        isVisible,
        wasVisible: data.isVisible,
      });
    });

    this.elementsInView.set(elements);
    this.animationFrame = this.win.requestAnimationFrame(() => this.updateElementPositions());
  }

  observe(element: HTMLElement): void {
    if (!element || this.observedElements.has(element)) return;

    // Immediately calculate initial position
    let initialProgress = 0;
    let initialVisible = false;
    if (this.win) {
      const rect = element.getBoundingClientRect();
      const viewportHeight = this.win.innerHeight;
      initialVisible = rect.top < viewportHeight && rect.bottom > 0;
      initialProgress = rect.height > 0
        ? Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height)))
        : 0;
    }

    this.observedElements.set(element, {
      element,
      top: 0,
      bottom: 0,
      height: 0,
      progress: initialProgress,
      isVisible: initialVisible,
      wasVisible: false,
    });

    if (this.prefersReducedMotion()) {
      element.classList.add('is-revealed');
    }

    // Trigger immediate update
    this.updateElementPositions();
  }

  unobserve(element: HTMLElement): void {
    this.observedElements.delete(element);
  }

  getScrollProgress(): number {
    return this.scrollPosition().progress;
  }

  getScrollY(): number {
    return this.scrollPosition().y;
  }

  getScrollDirection(): 'up' | 'down' | 'none' {
    return this.scrollPosition().direction;
  }

  getElementProgress(element: HTMLElement): number {
    const data = this.observedElements.get(element);
    return data?.progress ?? 0;
  }

  getElementData(element: HTMLElement): ElementScrollData | undefined {
    return this.observedElements.get(element);
  }

  isElementInView(element: HTMLElement): boolean {
    const data = this.observedElements.get(element);
    return data?.isVisible ?? false;
  }

  destroy(): void {
    if (this.win) {
      this.win.cancelAnimationFrame(this.animationFrame);
    }
    this.observer?.disconnect();
    this.observedElements.clear();
  }
}