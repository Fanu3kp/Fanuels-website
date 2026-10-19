import { Component, ElementRef, AfterViewInit, OnDestroy, Input, NgZone } from '@angular/core';

declare const VANTA: any;
declare const THREE: any;

@Component({
  selector: 'app-vanta-bg',
  standalone: true,
  template: `<div class="vanta-container"></div>`,
  styles: [`
    :host { display: block; position: absolute; inset: 0; z-index: 0; pointer-events: none; }
    .vanta-container { width: 100%; height: 100%; }
  `]
})
export class VantaBackgroundComponent implements AfterViewInit, OnDestroy {
  @Input() effect: 'NET' | 'WAVES' | 'CLOUDS' | 'GLOBE' | 'RINGS' | 'HALO' | 'BIRDS' | 'SUN' = 'WAVES';
  @Input() color = 0xec4899;
  @Input() backgroundColor = 0x0f172a;
  @Input() options: Record<string, any> = {};

  private vantaEffect: any;
  private container!: HTMLDivElement;

  constructor(private el: ElementRef, private zone: NgZone) {}

  ngAfterViewInit() {
    this.container = this.el.nativeElement.querySelector('.vanta-container');
    if (!this.container) return;

    this.zone.runOutsideAngular(() => {
      this.initVanta();
    });
  }

  private initVanta() {
    if (typeof VANTA === 'undefined' || typeof THREE === 'undefined') {
      console.warn('Vanta.js or Three.js not loaded');
      return;
    }

    const effectOptions = this.getEffectOptions();
    
    this.vantaEffect = VANTA[this.effect]({
      el: this.container,
      three: THREE,
      color: this.color,
      backgroundColor: this.backgroundColor,
      ...effectOptions,
      ...this.options
    });
  }

  private getEffectOptions(): Record<string, any> {
    switch (this.effect) {
      case 'WAVES':
        return { shininess: 50, waveHeight: 15, waveSpeed: 0.4, zoom: 1.1 };
      case 'NET':
        return { maxDistance: 22, spacing: 18, showDots: true };
      case 'CLOUDS':
        return { skyColor: this.backgroundColor, cloudColor: this.color, sunColor: 0xfbbf24, speed: 0.3 };
      case 'GLOBE':
        return { size: 1.2, spacing: 15, backgroundColor: this.backgroundColor };
      case 'RINGS':
        return { size: 1.5, spacing: 12, backgroundColor: this.backgroundColor };
      case 'HALO':
        return { size: 1.5, spacing: 12, backgroundColor: this.backgroundColor };
      case 'BIRDS':
        return { backgroundColor: this.backgroundColor, color1: this.color, color2: 0x06b6d4, birdSize: 1.2 };
      case 'SUN':
        return { backgroundColor: this.backgroundColor, color1: 0xfbbf24, color2: this.color };
      default:
        return {};
    }
  }

  ngOnDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
      this.vantaEffect = null;
    }
  }
}