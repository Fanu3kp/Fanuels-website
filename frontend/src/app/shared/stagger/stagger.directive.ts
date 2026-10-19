import {
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
  OnDestroy,
  NgZone,
  effect,
  AfterViewInit,
} from '@angular/core';
import { ScrollAnimationService } from '../../core/scroll-animation.service';

@Directive({
  selector: '[appStagger]',
  standalone: true,
})
export class StaggerDirective implements OnInit, OnDestroy, AfterViewInit {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly scrollService = inject(ScrollAnimationService);

  readonly appStagger = input<number>(100);
  readonly appStaggerThreshold = input(0.15);
  readonly appStaggerOnce = input(true);
  readonly appStaggerDirection = input<'up' | 'down' | 'left' | 'right'>('up');

  private revealed = false;
  private fallbackTriggered = false;

  ngAfterViewInit(): void {
    const children = Array.from(this.el.nativeElement.children) as HTMLElement[];
    children.forEach((child, index) => {
      child.style.opacity = '0';
      child.style.transition = `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)`;
      child.style.willChange = 'opacity, transform';
      this.setInitialTransform(child, index);
    });

    this.scrollService.observe(this.el.nativeElement);

    this.zone.runOutsideAngular(() => {
      effect(() => {
        if (!this.scrollService.initialUpdateComplete()) return;
        if (this.scrollService.prefersReducedMotion()) {
          this.revealAll();
          return;
        }

        const data = this.scrollService.getElementData(this.el.nativeElement);
        if (!data) return;

        const progress = data.progress;
        const threshold = this.appStaggerThreshold();

        if (progress >= threshold && !this.revealed) {
          this.revealed = true;
          this.revealAll();
        }
      });
    });

    // Fallback: reveal after 2s if scroll detection fails
    setTimeout(() => {
      if (!this.revealed) {
        this.revealed = true;
        this.fallbackTriggered = true;
        this.revealAll();
      }
    }, 2000);
  }

  private setInitialTransform(child: HTMLElement, index: number): void {
    const direction = this.appStaggerDirection();
    const delay = index * this.appStagger();

    child.style.transitionDelay = `${delay}ms`;

    switch (direction) {
      case 'up':
        child.style.transform = 'translateY(40px)';
        break;
      case 'down':
        child.style.transform = 'translateY(-40px)';
        break;
      case 'left':
        child.style.transform = 'translateX(40px)';
        break;
      case 'right':
        child.style.transform = 'translateX(-40px)';
        break;
    }
  }

  private revealAll(): void {
    const children = Array.from(this.el.nativeElement.children) as HTMLElement[];
    children.forEach((child) => {
      child.style.opacity = '1';
      child.style.transform = 'translate(0, 0)';
    });
    this.el.nativeElement.classList.add('is-revealed');
  }

  private hideAll(): void {
    const children = Array.from(this.el.nativeElement.children) as HTMLElement[];
    children.forEach((child, index) => {
      child.style.opacity = '0';
      this.setInitialTransform(child, index);
    });
    this.el.nativeElement.classList.remove('is-revealed');
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.scrollService.unobserve(this.el.nativeElement);
  }
}