import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SiteHeaderComponent } from './layout/site-header/site-header.component';
import { SiteFooterComponent } from './layout/site-footer/site-footer.component';
import { ScrollTopComponent } from './shared/scroll-top/scroll-top.component';
import { CookieConsentComponent } from './shared/cookie-consent/cookie-consent.component';
import { NewsletterComponent } from './shared/newsletter/newsletter.component';

type TravelDirection = 'forward' | 'back';

const ROUTE_SEQUENCE: string[] = [
  '',
  'about',
  'services',
  'insights',
  'projects',
  'business',
  'contact',
  'search',
];

function routeRank(url: string): number {
  const path = url.split('?')[0].split('#')[0];
  const segment = path.split('/').filter(Boolean)[0] ?? '';
  const rank = ROUTE_SEQUENCE.indexOf(segment);
  return rank === -1 ? ROUTE_SEQUENCE.length : rank;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent, ScrollTopComponent, CookieConsentComponent, NewsletterComponent],
  template: `
    <app-site-header />
    <main class="app-main">
      <div
        class="page-transition"
        [class.page-transition--enter]="entering()"
        [class.page-transition--forward]="direction() === 'forward'"
      >
        <span class="page-wipe" aria-hidden="true"></span>
        <router-outlet />
      </div>
    </main>
    <app-site-footer />
    <app-newsletter />
    <app-scroll-top />
    <app-cookie-consent />
  `,
  styles: [`
    :host { display: flex; flex-direction: column; min-height: 100vh; }

    .app-main { flex: 1; position: relative; overflow-x: clip; }

    .page-transition { position: relative; }

    .page-wipe {
      position: absolute;
      inset: 0;
      z-index: 5;
      overflow: hidden;
      pointer-events: none;
      opacity: 0;
    }

    .page-wipe::before {
      content: '';
      position: absolute;
      inset: -10% 0;
      transform: translate3d(-100%, 0, 0);
      background: linear-gradient(
        100deg,
        rgba(196, 31, 114, 0) 38%,
        rgba(232, 92, 157, 0.1) 45%,
        rgba(232, 92, 157, 0.34) 50%,
        rgba(0, 172, 193, 0.16) 53%,
        rgba(196, 31, 114, 0) 62%
      );
    }

    .page-transition--enter {
      animation: pageSlideForward var(--motion-duration-slow) var(--motion-ease-entrance) backwards;
    }

    .page-transition--enter.page-transition--forward {
      animation-name: pageSlideForward;
    }

    .page-transition--enter:not(.page-transition--forward) {
      animation-name: pageSlideBack;
    }

    .page-transition--enter.page-transition--forward .page-wipe::before {
      animation: wipeSweep 640ms var(--motion-ease-standard);
    }

    .page-transition--enter:not(.page-transition--forward) .page-wipe::before {
      animation: wipeSweepBack 640ms var(--motion-ease-standard);
    }
  `],
})
export class AppComponent {
  private readonly router = inject(Router);

  readonly entering = signal(true);
  readonly direction = signal<TravelDirection>('forward');

  private rank = routeRank(this.router.url);

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event) => {
        const nextRank = routeRank(event.urlAfterRedirects);
        this.direction.set(nextRank < this.rank ? 'back' : 'forward');
        this.rank = nextRank;

        this.entering.set(false);
        requestAnimationFrame(() => requestAnimationFrame(() => this.entering.set(true)));
      });
  }
}