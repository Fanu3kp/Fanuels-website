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
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly scrollService = inject(ScrollAnimationService);

  readonly appParallax = input<number>(0.3);
  readonly appParallaxDirection = input<'vertical' | 'horizontal'>('vertical');

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      effect(() => {
        const pos = this.scrollService.scrollPosition();
        const speed = this.appParallax();
        const direction = this.appParallaxDirection();

        if (this.scrollService.prefersReducedMotion()) return;

        const transform = direction === 'vertical'
          ? `translateY(${pos.y * speed}px)`
          : `translateX(${pos.y * speed}px)`;

        this.el.nativeElement.style.transform = transform;
        this.el.nativeElement.style.willChange = 'transform';
      });
    });

    this.scrollService.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.scrollService.unobserve(this.el.nativeElement);
  }
}