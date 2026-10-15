import { Component, ElementRef, AfterViewInit, OnDestroy, Input, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const Hydra: any;

@Component({
  selector: 'app-hydra-bg',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hydra-container" #container>
      <canvas #canvas></canvas>
      <div class="hydra-ui" *ngIf="showControls">
        <div class="hydra-toolbar">
          <button class="hydra-btn" (click)="togglePlay()" [attr.aria-pressed]="isPlaying">
            {{ isPlaying ? '⏸ Pause' : '▶ Play' }}
          </button>
          <button class="hydra-btn" (click)="randomize()">🎲 Randomize</button>
          <button class="hydra-btn" (click)="savePreset()">💾 Save</button>
          <button class="hydra-btn" (click)="loadPreset()">📂 Load</button>
          <button class="hydra-btn hydra-btn--danger" (click)="clearAll()">🗑 Clear</button>
        </div>
        <div class="hydra-editor" *ngIf="showEditor">
          <textarea
            #codeEditor
            class="hydra-code"
            [value]="currentCode"
            (input)="onCodeChange($event)"
            placeholder="Enter Hydra code... e.g., s0.initVideo().osc(10, 0.1, 1.5).color(1, 0.5, 0.2).out()"
            spellcheck="false"
            autocomplete="off"
          ></textarea>
          <div class="hydra-hints">
            <span>Sources: s0, s1, s2, s3 | Ops: .osc() .noise() .shape() .voronoi()</span>
            <span>Mods: .kaleid() .pixelate() .rotate() .scale() .color() .blend() .modulate()</span>
            <span>Output: .out() .out(o0) | Press Ctrl+Enter to evaluate</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; position: absolute; inset: 0; z-index: 0; background: #000; }
    .hydra-container { position: relative; width: 100%; height: 100%; overflow: hidden; }
    .hydra-container canvas { width: 100%; height: 100%; display: block; }
    .hydra-ui { position: absolute; bottom: 0; left: 0; right: 0; z-index: 10; background: linear-gradient(180deg, transparent, rgba(0,0,0,0.9)); padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #e2e8f0; }
    .hydra-toolbar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
    .hydra-btn { background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(148, 163, 184, 0.3); color: #e2e8f0; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-family: inherit; font-size: 11px; transition: all 0.15s; backdrop-filter: blur(8px); }
    .hydra-btn:hover { background: rgba(51, 65, 85, 0.9); border-color: #06b6d4; color: #06b6d4; }
    .hydra-btn--danger:hover { border-color: #ef4444; color: #ef4444; }
    .hydra-editor { max-height: 200px; overflow: hidden; transition: max-height 0.3s ease; }
    .hydra-code { width: 100%; min-height: 120px; background: #0f172a; border: 1px solid #1e293b; color: #e2e8f0; padding: 12px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 1.5; resize: vertical; outline: none; }
    .hydra-code:focus { border-color: #06b6d4; box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2); }
    .hydra-hints { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; font-size: 10px; color: #64748b; opacity: 0.8; }
  `]
})
export class HydraBackgroundComponent implements AfterViewInit, OnDestroy {
  @Input() showControls = true;
  @Input() showEditor = true;
  @Input() initialCode = '';
  @Input() autoStart = true;

  private hydra: any = null;
  private canvas!: HTMLCanvasElement;
  private container!: HTMLDivElement;
  isPlaying = false;
  currentCode = '';

  readonly presets = [
    's0.initVideo().osc(10, 0.1, 1.5).color(1, 0.5, 0.2).out()',
    's0.initVideo().noise(3, 0.1).kaleid(4).out()',
    's0.initVideo().voronoi(10, 0.5, 1).colorama(0.5).out()',
    's0.initVideo().shape(3, 0.5, 1).rotate(0.1, 0.05).modulate(s0.initVideo().osc(5), 0.5).out()',
    's0.initVideo().src(o0).pixelate(100, 100).modulate(s0.initVideo().noise(2), 0.3).out()',
    'osc(30, 0.01, 2).color(1, 0.2, 0.8).kaleid(8).out()',
    'noise(5, 0.05).colorama(0.3).kaleid(6).out()',
    'shape(4, 0.3, 1).rotate(() => time * 0.1).modulate(osc(10), 0.5).out()',
    'voronoi(20).color(0.5, 1, 0.3).modulate(noise(3), 0.2).out()',
    'solid(1, 0.2, 0.8).layer(osc(20, 0.1, 2).colorama(0.5)).out()'
  ];

  constructor(private el: ElementRef, private zone: NgZone) {}

  ngAfterViewInit() {
    this.container = this.el.nativeElement.querySelector('.hydra-container');
    this.canvas = this.el.nativeElement.querySelector('canvas');
    if (!this.container || !this.canvas) return;

    this.zone.runOutsideAngular(() => {
      this.initHydra();
    });
  }

  private initHydra() {
    if (typeof Hydra === 'undefined') {
      console.warn('Hydra not loaded');
      return;
    }

    try {
      this.hydra = new Hydra({
        canvas: this.canvas,
        detectAudio: false,
        enableStreamCapture: false,
        numSources: 4,
        numOutputs: 1,
        makeGlobal: true
      });

      if (this.autoStart && this.initialCode) {
        this.evaluateCode(this.initialCode);
        this.currentCode = this.initialCode;
        this.isPlaying = true;
      } else if (this.autoStart) {
        const randomPreset = this.presets[Math.floor(Math.random() * this.presets.length)];
        this.evaluateCode(randomPreset);
        this.currentCode = randomPreset;
        this.isPlaying = true;
      }
    } catch (e) {
      console.error('Hydra init failed:', e);
    }
  }

  private evaluateCode(code: string) {
    if (!this.hydra || !code.trim()) return;
    try {
      eval(code);
    } catch (e) {
      console.error('Hydra eval error:', e);
    }
  }

  togglePlay() {
    if (!this.hydra) return;
    if (this.isPlaying) {
      // Hydra doesn't have a simple pause, so we render a black frame
      this.hydra.renderer.render();
      this.isPlaying = false;
    } else {
      if (this.currentCode) {
        this.evaluateCode(this.currentCode);
      }
      this.isPlaying = true;
    }
  }

  randomize() {
    const preset = this.presets[Math.floor(Math.random() * this.presets.length)];
    this.currentCode = preset;
    this.evaluateCode(preset);
    this.isPlaying = true;
  }

  savePreset() {
    if (!this.currentCode) return;
    const presets = JSON.parse(localStorage.getItem('hydra-presets') || '[]');
    presets.push({ code: this.currentCode, timestamp: Date.now() });
    localStorage.setItem('hydra-presets', JSON.stringify(presets.slice(-20)));
    alert('Preset saved!');
  }

  loadPreset() {
    const presets = JSON.parse(localStorage.getItem('hydra-presets') || '[]');
    if (presets.length === 0) {
      alert('No saved presets');
      return;
    }
    const preset = presets[presets.length - 1];
    this.currentCode = preset.code;
    this.evaluateCode(preset.code);
    this.isPlaying = true;
  }

  clearAll() {
    if (!this.hydra) return;
    try {
      eval('s0.init().out()');
      this.currentCode = '';
      this.isPlaying = false;
    } catch (e) {
      console.error('Clear failed:', e);
    }
  }

  onCodeChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.currentCode = target.value;
  }

  // Handle Ctrl+Enter in textarea
  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      this.evaluateCode(this.currentCode);
      this.isPlaying = true;
    }
  }

  ngOnDestroy() {
    if (this.hydra) {
      try {
        this.hydra.destroy();
      } catch (e) {
        console.warn('Hydra destroy error:', e);
      }
      this.hydra = null;
    }
  }
}