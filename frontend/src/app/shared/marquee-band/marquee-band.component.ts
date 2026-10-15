import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-marquee-band',
  standalone: true,
  imports: [NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="marquee"
      [class.marquee--light]="variant() === 'light'"
      [style.--marquee-duration]="duration() + 's'"
    >
      <div class="marquee__run" role="list" [attr.aria-label]="label()">
        <span class="marquee__item" role="listitem" *ngFor="let item of items()">
          <span class="marquee__dot" aria-hidden="true"></span>
          {{ item }}
        </span>
      </div>
      <div class="marquee__run" aria-hidden="true">
        <span class="marquee__item" *ngFor="let item of items()">
          <span class="marquee__dot" aria-hidden="true"></span>
          {{ item }}
        </span>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        overflow: hidden;
      }

      .marquee {
        --marquee-fg: #cbd5e1;
        --marquee-dot: var(--pink-500);
        display: flex;
        width: max-content;
        padding: 18px 0;
        background: var(--navy-900);
        color: var(--marquee-fg);
        border-block: 1px solid rgba(255, 255, 255, 0.07);
        animation: marquee-scroll var(--marquee-duration, 38s) linear infinite;
      }

      .marquee:hover,
      .marquee:focus-within {
        animation-play-state: paused;
      }

      .marquee--light {
        --marquee-fg: var(--slate-700);
        --marquee-dot: var(--blue-600);
        background: var(--blue-50);
        border-block-color: var(--slate-200);
      }

      .marquee__run {
        display: flex;
        align-items: center;
        gap: 3rem;
        flex-shrink: 0;
        padding-right: 3rem;
      }

      .marquee__item {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        font-size: 0.86rem;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .marquee__dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--marquee-dot);
        flex-shrink: 0;
        animation: marquee-pulse 2.2s ease-in-out infinite;
      }

      .marquee__item:nth-child(2n) .marquee__dot {
        animation-delay: 0.4s;
      }

      .marquee__item:nth-child(3n) .marquee__dot {
        animation-delay: 0.8s;
      }

      @keyframes marquee-scroll {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(-50%);
        }
      }

      @keyframes marquee-pulse {
        0%,
        100% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.6);
          opacity: 0.45;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .marquee,
        .marquee__dot {
          animation: none;
        }
      }
    `,
  ],
})
export class MarqueeBandComponent {
  readonly items = input.required<string[]>();
  readonly variant = input<'dark' | 'light'>('dark');
  readonly duration = input(38);
  readonly label = input('Areas of capability');
}