import { Directive, ElementRef, effect, inject, input, signal } from '@angular/core';

@Directive({
  selector: '[appCounter]',
  standalone: true,
})
export class CounterDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  readonly target = input.required<number>({ alias: 'appCounter' });
  readonly duration = input(2000);
  readonly delay = input(0);
  readonly easing = input<'linear' | 'easeOut' | 'easeInOut'>('easeOut');

  private readonly inView = signal(false);
  private generation = 0;

  constructor() {
    // Re-run the count whenever the target changes (e.g. async data
    // arriving after the first render) or the element scrolls into view.
    effect(() => {
      const target = this.target();
      if (!this.inView()) return;

      if (this.prefersReducedMotion()) {
        this.el.nativeElement.textContent = this.formatNumber(target);
        return;
      }

      const generation = ++this.generation;
      setTimeout(() => {
        if (generation === this.generation) {
          this.animate(generation);
        }
      }, this.delay());
    });
  }

  ngOnInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.inView.set(true);
            observer.unobserve(this.el.nativeElement);
          }
        });
      },
      { threshold: 0.5, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(this.el.nativeElement);
  }

  private animate(generation: number): void {
    const element = this.el.nativeElement;
    const targetValue = this.target();
    const duration = this.duration();
    const startTime = performance.now();

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInOut = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const linear = (t: number) => t;

    const easingFn =
      this.easing() === 'linear'
        ? linear
        : this.easing() === 'easeInOut'
        ? easeInOut
        : easeOut;

    const animate = (currentTime: number) => {
      if (generation !== this.generation) return;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFn(progress);
      const currentValue = Math.round(targetValue * easedProgress);

      element.textContent = this.formatNumber(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = this.formatNumber(targetValue);
      }
    };

    requestAnimationFrame(animate);
  }

  private prefersReducedMotion(): boolean {
    return (
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  private formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  }
}
