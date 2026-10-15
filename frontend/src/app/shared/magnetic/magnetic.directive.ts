import {
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
  OnDestroy,
  HostListener,
  NgZone,
} from '@angular/core';
import { ScrollAnimationService } from '../../core/scroll-animation.service';

@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly scrollService = inject(ScrollAnimationService);

  readonly appMagnetic = input<number>(0.3);
  readonly appMagneticArea = input<number>(100);

  private animationFrame = 0;
  private bounds: DOMRect | null = null;

  ngOnInit(): void {
    this.updateBounds();
    this.scrollService.observe(this.el.nativeElement);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.scrollService.prefersReducedMotion()) return;

    this.zone.runOutsideAngular(() => {
      this.bounds = this.el.nativeElement.getBoundingClientRect();
      const centerX = this.bounds.left + this.bounds.width / 2;
      const centerY = this.bounds.top + this.bounds.height / 2;

      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const area = this.appMagneticArea();

      if (distance > area) {
        this.resetPosition();
        return;
      }

      const strength = this.appMagnetic() * (1 - distance / area);
      const moveX = deltaX * strength;
      const moveY = deltaY * strength;

      this.el.nativeElement.style.transform = `translate(${moveX}px, ${moveY}px)`;
      this.el.nativeElement.style.transition = 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)';
      this.el.nativeElement.style.willChange = 'transform';
    });
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.resetPosition();
  }

  private resetPosition(): void {
    this.zone.runOutsideAngular(() => {
      this.el.nativeElement.style.transform = 'translate(0, 0)';
      this.el.nativeElement.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  }

  private updateBounds(): void {
    this.bounds = this.el.nativeElement.getBoundingClientRect();
  }

  ngOnDestroy(): void {
    this.scrollService.unobserve(this.el.nativeElement);
  }
}