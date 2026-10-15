import { Component, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HydraBackgroundComponent } from '../../shared/hydra-background/hydra-background.component';
import { RevealDirective } from '../../shared/reveal/reveal.directive';

const LAB_PRESETS = [
  { name: 'Oscillator Waves', code: 's0.initVideo().osc(10, 0.1, 1.5).color(1, 0.5, 0.2).out()', desc: 'Classic RGB oscillators with color shift' },
  { name: 'Kaleidoscope Noise', code: 's0.initVideo().noise(3, 0.1).kaleid(4).out()', desc: 'Fractal noise with 4-fold symmetry' },
  { name: 'Voronoi Cells', code: 's0.initVideo().voronoi(10, 0.5, 1).colorama(0.5).out()', desc: 'Living cellular structures' },
  { name: 'Spinning Shapes', code: 's0.initVideo().shape(3, 0.5, 1).rotate(0.1, 0.05).modulate(s0.initVideo().osc(5), 0.5).out()', desc: 'Rotating triangles with wave modulation' },
  { name: 'Pixelated Dreams', code: 's0.initVideo().src(o0).pixelate(100, 100).modulate(s0.initVideo().noise(2), 0.3).out()', desc: 'Retro pixelation with noise warp' },
  { name: 'Pure Oscillator', code: 'osc(30, 0.01, 2).color(1, 0.2, 0.8).kaleid(8).out()', desc: 'No camera - pure math visualization' },
  { name: 'Colorama Noise', code: 'noise(5, 0.05).colorama(0.3).kaleid(6).out()', desc: 'Shifting color palette on noise' },
  { name: 'Modulated Geometry', code: 'shape(4, 0.3, 1).rotate(() => time * 0.1).modulate(osc(10), 0.5).out()', desc: 'Time-driven rotation with wave modulation' },
  { name: 'Voronoi Flow', code: 'voronoi(20).color(0.5, 1, 0.3).modulate(noise(3), 0.2).out()', desc: 'Organic cells with noise displacement' },
  { name: 'Layered Solids', code: 'solid(1, 0.2, 0.8).layer(osc(20, 0.1, 2).colorama(0.5)).out()', desc: 'Color layers with oscillator overlay' },
  { name: 'Feedback Loop', code: 's0.initVideo().src(o0).scale(1.02).rotate(0.01).modulate(osc(5, 0.1), 0.1).out()', desc: 'Infinite mirror feedback effect' },
  { name: 'RGB Shift', code: 's0.initVideo().rgbshift(0.01, 0.02).kaleid(3).colorama(0.1).out()', desc: 'Chromatic aberration with symmetry' }
];

@Component({
  selector: 'app-lab',
  standalone: true,
  imports: [CommonModule, RouterLink, HydraBackgroundComponent, RevealDirective],
  template: `
    <section class="lab-hero">
      <app-hydra-bg
        #hydraBg
        [showControls]="true"
        [showEditor]="true"
        [autoStart]="true"
        [initialCode]="currentPreset?.code || ''"
      ></app-hydra-bg>
      <div class="container lab-hero__content" appReveal="up">
        <span class="eyebrow eyebrow--light">Experimental Lab</span>
        <h1>Live-coded visual synthesis</h1>
        <p>Hydra is a live-coding environment for real-time video synthesis. Write shader code, see instant results. No build step, no refresh.</p>
        <div class="lab-hero__actions">
          <button class="btn btn--light" (click)="toggleFullscreen()">⛶ Fullscreen</button>
          <a routerLink="/" class="btn btn--ghost">← Back to Site</a>
        </div>
      </div>
    </section>

    <section class="section section--dark">
      <div class="container">
        <div class="section-head" appReveal="up">
          <span class="eyebrow eyebrow--light">Presets</span>
          <h2>Starting points for exploration</h2>
          <p>Click any preset to load it. Edit the code in the textarea below the canvas. Press <kbd>Ctrl+Enter</kbd> to evaluate.</p>
        </div>

        <div class="presets-grid">
          <article
            class="preset-card"
            *ngFor="let preset of presets; let i = index"
            (click)="loadPreset(preset)"
            [class.active]="currentPreset === preset"
            appReveal="up"
            [appRevealDelay]="i * 40"
          >
            <h3>{{ preset.name }}</h3>
            <p>{{ preset.desc }}</p>
            <code class="preset-code">{{ preset.code }}</code>
            <span class="preset-action">Click to load →</span>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head" appReveal="up">
          <span class="eyebrow">Reference</span>
          <h2>Hydra Quick Reference</h2>
          <p>Essential functions for live coding visuals.</p>
        </div>

        <div class="reference-grid">
          <div class="ref-category" appReveal="up">
            <h3>Sources</h3>
            <ul>
              <li><code>s0.initVideo()</code> — Webcam input</li>
              <li><code>s0.initImage(url)</code> — Image source</li>
              <li><code>s0.initVideo().src(o0)</code> — Previous output</li>
              <li><code>osc(freq, sync, offset)</code> — Oscillator</li>
              <li><code>noise(scale, speed)</code> — Perlin noise</li>
              <li><code>shape(sides, radius, smoothing)</code> — Polygon</li>
              <li><code>voronoi(cells, speed, zoom)</code> — Cellular</li>
              <li><code>solid(r, g, b)</code> — Solid color</li>
              <li><code>gradient()</code> — Linear gradient</li>
            </ul>
          </div>

          <div class="ref-category" appReveal="up" [appRevealDelay]="50">
            <h3>Transforms</h3>
            <ul>
              <li><code>.rotate(angle, speed)</code></li>
              <li><code>.scale(x, y)</code></li>
              <li><code>.translate(x, y)</code></li>
              <li><code>.pixelate(x, y)</code></li>
              <li><code>.kaleid(sides)</code></li>
              <li><code>.rgbshift(r, g, b)</code></li>
              <li><code>.color(r, g, b)</code></li>
              <li><code>.colorama(speed)</code></li>
              <li><code>.contrast(amount)</code></li>
              <li><code>.brightness(amount)</code></li>
            </ul>
          </div>

          <div class="ref-category" appReveal="up" [appRevealDelay]="100">
            <h3>Modulation</h3>
            <ul>
              <li><code>.modulate(src, amount)</code> — Displace</li>
              <li><code>.modulateScale(src, amount)</code></li>
              <li><code>.modulateRotate(src, amount)</code></li>
              <li><code>.modulatePixelate(src, amount)</code></li>
              <li><code>.modulateHue(src, amount)</code></li>
            </ul>
          </div>

          <div class="ref-category" appReveal="up" [appRevealDelay]="150">
            <h3>Blending & Output</h3>
            <ul>
              <li><code>.add(src)</code> — Additive</li>
              <li><code>.mult(src)</code> — Multiply</li>
              <li><code>.layer(src)</code> — Alpha over</li>
              <li><code>.blend(src, amount)</code> — Mix</li>
              <li><code>.diff(src)</code> — Difference</li>
              <li><code>.out()</code> — To canvas</li>
              <li><code>.out(o0)</code> — To output 0</li>
              <li><code>.hide()</code> — Hide source</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container cta__inner" appReveal="up">
        <h2>Want to go deeper?</h2>
        <p>Hydra runs in the browser. Visit <a href="https://hydra.ojack.xyz/" target="_blank" rel="noopener">hydra.ojack.xyz</a> for the full live editor, or check out <a href="https://github.com/ojack/hydra" target="_blank" rel="noopener">the GitHub repo</a>.</p>
        <a routerLink="/contact" class="btn btn--primary">Build something real with us →</a>
      </div>
    </section>
  `,
  styles: [`
    .lab-hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
      color: #fff;
    }
    .lab-hero__content {
      position: relative;
      z-index: 1;
      max-width: 720px;
      text-align: center;
      padding: 40px 20px;
    }
    .lab-hero .eyebrow { color: #06b6d4; }
    .lab-hero h1 {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 800;
      line-height: 1.1;
      margin: 16px 0 20px;
      background: linear-gradient(90deg, #fff, #06b6d4, #ec4899);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .lab-hero p { font-size: 1.15rem; color: #cbd5e1; margin-bottom: 32px; line-height: 1.7; }
    .lab-hero__actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
    kbd { background: #1e293b; border: 1px solid #334155; padding: 2px 6px; border-radius: 4px; font-family: inherit; font-size: 0.85em; }

    .presets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    .preset-card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }
    .preset-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, #ec4899, #06b6d4);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
    }
    .preset-card:hover {
      border-color: #06b6d4;
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }
    .preset-card:hover::before,
    .preset-card.active::before { transform: scaleX(1); }
    .preset-card.active { border-color: #06b6d4; }
    .preset-card h3 { margin: 0 0 8px; font-size: 1.1rem; color: #fff; }
    .preset-card p { margin: 0 0 16px; font-size: 0.85rem; color: #94a3b8; line-height: 1.5; }
    .preset-code {
      display: block;
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 0.75rem;
      line-height: 1.5;
      color: #64748b;
      overflow-x: auto;
      margin-bottom: 12px;
      font-family: 'JetBrains Mono', monospace;
    }
    .preset-action { font-size: 0.8rem; color: #06b6d4; font-weight: 600; opacity: 0; transform: translateY(4px); transition: all 0.2s; }
    .preset-card:hover .preset-action { opacity: 1; transform: translateY(0); }

    .reference-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 24px;
    }
    .ref-category { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; }
    .ref-category h3 { margin: 0 0 16px; font-size: 1rem; color: #0f172a; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
    .ref-category ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
    .ref-category li { font-size: 0.85rem; color: #334155; }
    .ref-category code { background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 0.8em; font-family: 'JetBrains Mono', monospace; color: #0f172a; }

    @media (max-width: 768px) {
      .lab-hero { min-height: 80vh; }
      .reference-grid { grid-template-columns: 1fr; }
    }

    @media (prefers-reduced-motion: reduce) {
      .preset-card { transition: none; }
    }
  `]
})
export class LabComponent implements OnDestroy {
  presets = LAB_PRESETS;
  currentPreset = LAB_PRESETS[0];
  isFullscreen = false;

  loadPreset(preset: typeof LAB_PRESETS[0]) {
    this.currentPreset = preset;
  }

  toggleFullscreen() {
    const container = document.querySelector('.lab-hero .hydra-container') as HTMLElement;
    if (!container) return;

    if (!this.isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
      this.isFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      this.isFullscreen = false;
    }
  }

  @HostListener('document:fullscreenchange')
  onFullscreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
  }

  ngOnDestroy() {
    if (this.isFullscreen && document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}