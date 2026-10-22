import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { RevealDirective } from '../reveal/reveal.directive';

@Component({
  selector: 'app-page-hero',
  standalone: true,
  imports: [NgIf, RevealDirective],
  template: `
    <section class="hero">
      <img class="hero__bg-image" [src]="backgroundImage" alt="" aria-hidden="true" decoding="async" />
      <div class="container">
        <span class="eyebrow eyebrow--light" appReveal="mask">{{ eyebrow }}</span>
        <h1 appReveal="mask" [appRevealDelay]="70">{{ title }}</h1>
        <p *ngIf="subtitle" appReveal="mask" [appRevealDelay]="150">{{ subtitle }}</p>
      </div>
    </section>
  `,
  styles: [
    `
      .hero {
        position: relative;
        background: linear-gradient(120deg, var(--navy-900) 0%, var(--navy-700) 55%, var(--blue-600) 130%);
        padding: 120px 0 100px;
        color: #cbd5e1;
        overflow: hidden;
        text-align: center;
        isolation: isolate;
      }
      .hero::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 30% 30%, rgba(232, 92, 157, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 70% 70%, rgba(0, 172, 193, 0.12) 0%, transparent 50%);
        z-index: 0;
        animation: float-smooth 16s ease-in-out infinite;
      }
      .hero__bg-image {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.18;
        z-index: 0;
        filter: blur(2px);
      }
      .hero .container {
        position: relative;
        z-index: 1;
      }
      h1 {
        color: var(--white);
        margin-bottom: 16px;
        max-width: 100%;
        font-size: clamp(2.2rem, 5vw, 3.2rem);
        line-height: 1.15;
        font-weight: 800;
        letter-spacing: -0.02em;
      }
      .eyebrow {
        font-size: 1.2rem;
        letter-spacing: 0.14em;
        max-width: 100%;
        color: var(--pink-300);
        font-weight: 700;
        text-transform: uppercase;
        display: block;
        margin-bottom: 10px;
      }
      p {
        font-size: 1.3rem;
        max-width: 700px;
        margin: 0 auto;
        color: #dbe4f0;
        line-height: 1.7;
        font-weight: 400;
      }
    `,
  ],
})
export class PageHeroComponent {
  @Input({ required: true }) eyebrow = '';
  @Input({ required: true }) title = '';
  @Input() subtitle?: string;
  @Input() backgroundImage = 'images/backgrounds/section-bg.svg';
}
