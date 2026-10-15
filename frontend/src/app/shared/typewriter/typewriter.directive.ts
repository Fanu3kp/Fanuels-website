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
  selector: '[appTypewriter]',
  standalone: true,
})
export class TypewriterDirective implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly scrollService = inject(ScrollAnimationService);

  readonly appTypewriter = input<string>('');
  readonly appTypewriterSpeed = input(50);
  readonly appTypewriterDelay = input(0);
  readonly appTypewriterCursor = input(true);
  readonly appTypewriterLoop = input(false);
  readonly appTypewriterThreshold = input(0.2);
  readonly appTypewriterOnce = input(true);

  private animated = false;

  ngOnInit(): void {
    const text = this.appTypewriter() || this.el.nativeElement.textContent || '';
    this.el.nativeElement.textContent = '';
    this.el.nativeElement.style.whiteSpace = 'nowrap';
    this.el.nativeElement.style.overflow = 'hidden';
    this.el.nativeElement.style.borderRight = this.appTypewriterCursor() ? '2px solid var(--pink-600)' : 'none';
    this.el.nativeElement.style.animation = this.appTypewriterCursor() ? 'blink 1s infinite' : 'none';

    this.scrollService.observe(this.el.nativeElement);

    this.zone.runOutsideAngular(() => {
      effect(() => {
        if (!this.scrollService.initialUpdateComplete()) return;
        if (this.scrollService.prefersReducedMotion()) {
          this.el.nativeElement.textContent = text;
          this.el.nativeElement.style.borderRight = 'none';
          return;
        }

        const data = this.scrollService.getElementData(this.el.nativeElement);
        if (!data) return;

        const progress = data.progress;
        const threshold = this.appTypewriterThreshold();

        if (progress >= threshold && !this.animated) {
          this.animated = true;
          setTimeout(() => this.startTypewriter(text), this.appTypewriterDelay());
        }
      });
    });

    // Fallback: start typewriter after 2s if scroll detection fails
    setTimeout(() => {
      if (!this.animated) {
        this.animated = true;
        this.startTypewriter(text);
      }
    }, 2000);
  }

  private startTypewriter(text: string): void {
    let index = 0;
    const speed = this.appTypewriterSpeed();
    const loop = this.appTypewriterLoop();

    const type = () => {
      if (index <= text.length) {
        this.el.nativeElement.textContent = text.slice(0, index);
        index++;
        setTimeout(type, speed + Math.random() * 100);
      } else if (loop) {
        setTimeout(() => {
          index = 0;
          this.el.nativeElement.textContent = '';
          type();
        }, 2000);
      } else {
        this.el.nativeElement.style.borderRight = 'none';
      }
    };

    type();
  }

  ngOnDestroy(): void {
    this.scrollService.unobserve(this.el.nativeElement);
  }
}