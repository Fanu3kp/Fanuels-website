import {
  DestroyRef,
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';

export type RevealVariant =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'scale'
  | 'blur'
  | 'fade'
  | 'mask';

const REVEALED_CLASS = 'is-revealed';
const WATCHDOG_MS = 1600;
const NEAR_VIEWPORT_RATIO = 1.5;

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly appReveal = input<RevealVariant>('up');
  readonly appRevealDelay = input(0);
  readonly appRevealThreshold = input(0.15);
  readonly appRevealOnce = input(true);

  private observer?: IntersectionObserver;
  private revealed = false;
  private watchdog = 0;
  private frame = 0;

  constructor() {
    effect(() => {
      const variant = this.appReveal();
      const delay = this.appRevealDelay();
      untracked(() => this.applyAttributes(variant, delay));
    });

    this.destroyRef.onDestroy(() => this.cancelTimers());
  }

  ngOnInit(): void {
    this.applyAttributes(this.appReveal(), this.appRevealDelay());

    if (typeof window === 'undefined') {
      this.show();
      return;
    }

    if (this.prefersReducedMotion()) {
      this.show();
      return;
    }

    if (this.isInsideViewport()) {
      this.showAfterPaint();
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      this.show();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          this.show();
          if (this.appRevealOnce()) this.observer?.disconnect();
        }
      },
      { threshold: this.appRevealThreshold(), rootMargin: '0px 0px -60px 0px' }
    );

    this.observer.observe(this.el.nativeElement);

    this.watchdog = window.setTimeout(() => {
      this.watchdog = 0;
      if (!this.revealed && this.isNearViewport()) this.show();
    }, WATCHDOG_MS);
  }

  ngOnDestroy(): void {
    this.cancelTimers();
    this.observer?.disconnect();
  }

  private applyAttributes(variant: RevealVariant, delay: number): void {
    const node = this.el.nativeElement;
    node.dataset['reveal'] = variant;
    node.style.setProperty('--reveal-delay', `${Math.max(0, delay)}ms`);
  }

  private showAfterPaint(): void {
    this.frame = window.requestAnimationFrame(() => {
      this.frame = window.requestAnimationFrame(() => {
        this.frame = 0;
        this.show();
      });
    });
  }

  private show(): void {
    if (this.revealed) return;
    this.revealed = true;
    this.cancelTimers();
    this.el.nativeElement.classList.add(REVEALED_CLASS);
    this.observer?.disconnect();
  }

  private cancelTimers(): void {
    if (this.frame) {
      window.cancelAnimationFrame(this.frame);
      this.frame = 0;
    }
    if (this.watchdog) {
      window.clearTimeout(this.watchdog);
      this.watchdog = 0;
    }
  }

  private isInsideViewport(): boolean {
    const box = this.el.nativeElement.getBoundingClientRect();
    return box.top < window.innerHeight && box.bottom > 0;
  }

  private isNearViewport(): boolean {
    return this.el.nativeElement.getBoundingClientRect().top < window.innerHeight * NEAR_VIEWPORT_RATIO;
  }

  private prefersReducedMotion(): boolean {
    return (
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }
}
