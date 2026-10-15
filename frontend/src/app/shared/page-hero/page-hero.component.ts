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
        padding: 110px 0 90px;
        color: #cbd5e1;
        overflow: hidden;
      }
      .hero__bg-image {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.25;
        z-index: 0;
      }
      .hero .container {
        position: relative;
        z-index: 1;
      }
      h1 {
        color: var(--white);
        margin-bottom: 16px;
        max-width: 760px;
        font-size: clamp(2rem, 5vw, 3rem);
        line-height: 1.15;
      }
      .eyebrow {
        font-size: 1.4rem;
        letter-spacing: 0.14em;
      }
      p {
        font-size: 1.4rem;
        max-width: 640px;
        margin: 0;
        color: #dbe4f0;
        line-height: 1.6;
      }
    `,
  ],
})
export class PageHeroComponent {
  @Input({ required: true }) eyebrow = '';
  @Input({ required: true }) title = '';
  @Input() subtitle?: string;
  @Input() backgroundImage = '/images/backgrounds/section-bg.svg';
}