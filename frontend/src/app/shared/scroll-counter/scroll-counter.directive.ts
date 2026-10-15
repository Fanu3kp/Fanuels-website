import {
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
  OnDestroy,
  NgZone,
  effect,
} from '@angular/core';
import { ScrollAnimationService } from '../../core/scroll-animation.service';

@Directive({
  selector: '[appScrollCounter]',
  standalone: true,
})
export class ScrollCounterDirective implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly scrollService = inject(ScrollAnimationService);

  readonly appScrollCounter = input<number>(0);
  readonly appScrollCounterDuration = input(2000);
  readonly appScrollCounterDelay = input(0);
  readonly appScrollCounterEasing = input<'easeOut' | 'easeInOut' | 'linear'>('easeOut');
  readonly appScrollCounterPrefix = input('');
  readonly appScrollCounterSuffix = input('');
  readonly appScrollCounterDecimals = input(0);
  readonly appScrollCounterThreshold = input(0.3);
  readonly appScrollCounterOnce = input(true);

  private animated = false;

  ngOnInit(): void {
    this.el.nativeElement.textContent = this.formatNumber(0);
    this.scrollService.observe(this.el.nativeElement);

    this.zone.runOutsideAngular(() => {
      effect(() => {
        if (this.scrollService.prefersReducedMotion()) {
          this.animateToTarget();
          return;
        }

        const data = this.scrollService.getElementData(this.el.nativeElement);
        if (!data) return;

        const progress = data.progress;
        const threshold = this.appScrollCounterThreshold();

        if (progress >= threshold && !this.animated) {
          this.animated = true;
          setTimeout(() => this.animateToTarget(), this.appScrollCounterDelay());
        }
      });
    });
  }

  private animateToTarget(): void {
    const target = this.appScrollCounter();
    const duration = this.appScrollCounterDuration();
    const easing = this.appScrollCounterEasing();
    const startTime = performance.now();

    const ease = (t: number): number => {
      switch (easing) {
        case 'easeOut':
          return 1 - Math.pow(1 - t, 3);
        case 'easeInOut':
          return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        default:
          return t;
      }
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easedProgress = ease(progress);
      const currentValue = target * easedProgress;

      this.el.nativeElement.textContent = this.formatNumber(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  private formatNumber(value: number): string {
    const decimals = this.appScrollCounterDecimals();
    const formatted = value.toFixed(decimals);
    return `${this.appScrollCounterPrefix()}${formatted}${this.appScrollCounterSuffix()}`;
  }

  ngOnDestroy(): void {
    this.scrollService.unobserve(this.el.nativeElement);
  }
}