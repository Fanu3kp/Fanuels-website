import { Directive, ElementRef, HostListener, OnInit, inject } from '@angular/core';

@Directive({
  selector: 'img[loading="lazy"]',
  standalone: true,
})
export class LazyImageDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLImageElement>);
  private loadTimeout: any;

  ngOnInit(): void {
    // Cached images can finish loading before the host listeners attach,
    // which would leave them stuck in the blurred pre-load state.
    if (this.el.nativeElement.complete) {
      this.el.nativeElement.classList.add('loaded');
      return;
    }

    // Fallback: force visible after 3s if load event doesn't fire
    this.loadTimeout = setTimeout(() => {
      this.el.nativeElement.classList.add('loaded');
    }, 3000);
  }

  @HostListener('load')
  onLoad() {
    if (this.loadTimeout) clearTimeout(this.loadTimeout);
    this.el.nativeElement.classList.add('loaded');
  }

  @HostListener('error')
  onError() {
    if (this.loadTimeout) clearTimeout(this.loadTimeout);
    this.el.nativeElement.classList.add('loaded');
  }
}