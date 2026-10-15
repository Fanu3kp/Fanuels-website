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
  selector: '[appScrollText]',
  standalone: true,
})
export class ScrollTextDirective implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly scrollService = inject(ScrollAnimationService);

  readonly appScrollText = input<'reveal' | 'slide' | 'fade' | 'scale' | 'blur' | 'count'>('reveal');
  readonly appScrollTextDelay = input(0);
  readonly appScrollTextDuration = input(800);
  readonly appScrollTextThreshold = input(0.2);
  readonly appScrollTextOnce = input(true);

  private revealed = false;
  private fallbackTriggered = false;

  ngOnInit(): void {
    this.scrollService.observe(this.el.nativeElement);

    this.zone.runOutsideAngular(() => {
      effect(() => {
        if (!this.scrollService.initialUpdateComplete()) return;
        if (this.scrollService.prefersReducedMotion()) {
          this.applyRevealed();
          return;
        }

        const data = this.scrollService.getElementData(this.el.nativeElement);
        if (!data) return;

        const progress = data.progress;
        const threshold = this.appScrollTextThreshold();

        if (progress >= threshold && !this.revealed) {
          this.revealed = true;
          setTimeout(() => this.applyRevealed(), this.appScrollTextDelay());
        }
      });
    });

    // Fallback: reveal after 2s if scroll detection fails
    setTimeout(() => {
      if (!this.revealed) {
        this.revealed = true;
        this.fallbackTriggered = true;
        this.applyRevealed();
      }
    }, 2000);
  }

  private applyRevealed(): void {
    const type = this.appScrollText();
    const el = this.el.nativeElement;
    el.style.opacity = '1';
    el.style.transition = `all ${this.appScrollTextDuration()}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    el.style.willChange = 'opacity, transform, filter';

    switch (type) {
      case 'reveal':
        el.style.transform = 'translateY(0)';
        el.style.filter = 'blur(0)';
        break;
      case 'slide':
        el.style.transform = 'translateX(0)';
        break;
      case 'fade':
        el.style.transform = 'translateY(0)';
        break;
      case 'scale':
        el.style.transform = 'scale(1)';
        break;
      case 'blur':
        el.style.filter = 'blur(0)';
        el.style.transform = 'translateY(0)';
        break;
    }
    el.classList.add('is-revealed');
  }

  private applyHidden(): void {
    const type = this.appScrollText();
    const el = this.el.nativeElement;
    el.style.opacity = '0';

    switch (type) {
      case 'reveal':
        el.style.transform = 'translateY(40px)';
        el.style.filter = 'blur(8px)';
        break;
      case 'slide':
        el.style.transform = 'translateX(-40px)';
        break;
      case 'fade':
        el.style.transform = 'translateY(20px)';
        break;
      case 'scale':
        el.style.transform = 'scale(0.9)';
        break;
      case 'blur':
        el.style.filter = 'blur(12px)';
        el.style.transform = 'translateY(30px)';
        break;
    }
    el.classList.remove('is-revealed');
  }

  ngOnDestroy(): void {
    this.scrollService.unobserve(this.el.nativeElement);
  }
}