import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../shared/page-hero/page-hero.component';
import { RevealDirective } from '../../shared/reveal/reveal.directive';
import { OtuyaBusiness, businesses } from '../../core/businesses';

interface SharedService {
  name: string;
  desc: string;
  icon: string;
}

@Component({
  selector: 'app-structure',
  standalone: true,
  imports: [NgFor, RouterLink, PageHeroComponent, RevealDirective],
  template: `
    <app-page-hero
      eyebrow="Group structure"
      title="One group, four technology units, shared engineering core"
      subtitle="Otuya Global is the parent company. Four specialist technology units serve their own markets, and one shared services layer keeps them all moving."
      backgroundImage="/images/backgrounds/section-bg.svg"
    />

    <section class="section section--first">
      <div class="container structure__intro">
        <div class="structure__copy" appReveal="left">
          <span class="eyebrow">How the group is built</span>
          <h2>Close enough to move fast, big enough to be bankable</h2>
          <p>
            Each unit below runs its own commercial team, product
            knowledge and domain expertise. Nobody waits on a central
            committee to close a deal.
          </p>
          <p>
            Underneath them, one shared services layer — engineering,
            cloud, data, security and finance — is run once for the
            whole group. A unit inherits it instead of rebuilding
            it, and a client gets the same standards whichever door
            they walk through.
          </p>
        </div>
        <aside class="structure__facts" appReveal="right" [appRevealDelay]="100">
          <div class="fact">
            <strong>4</strong>
            <span>technology units</span>
          </div>
          <div class="fact">
            <strong>1</strong>
            <span>shared services layer</span>
          </div>
        </aside>
      </div>
    </section>

    <section class="section section--muted">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow" appReveal="up">The chart</span>
          <h2 appReveal="mask" [appRevealDelay]="70">Structure at a glance</h2>
          <p appReveal="mask" [appRevealDelay]="150">
            The parent company sits above four technology units.
            A shared services layer spans all of them.
          </p>
        </div>

        <figure class="org" appReveal="up">
          <figcaption class="sr-only">
            Otuya Global is the parent company. It owns four technology
            units — Otuya Software, Otuya Systems, Otuya Cloud and
            Otuya Advisory — all served by one shared services layer.
          </figcaption>

          <div class="org__parent">
            <div class="org__node org__node--parent">
              <span class="org__mark" aria-hidden="true">OG</span>
              <strong>Otuya Global</strong>
              <span>Group parent company</span>
            </div>
            <div class="org__stem" aria-hidden="true"></div>
          </div>

          <div class="org__verticals">
            <div
              class="org__col"
              *ngFor="let business of businesses"
              [style.--accent]="business.accent"
            >
              <div class="org__node org__node--vertical">
                <span class="org__mark" aria-hidden="true">{{ business.mark }}</span>
                <strong>{{ business.name }}</strong>
                <span>{{ business.descriptor }}</span>
              </div>
            </div>
          </div>

          <div class="org__stem org__stem--wide" aria-hidden="true"></div>

          <div class="org__shared">
            <span class="org__shared-label">Shared services — one layer, every unit</span>
            <div class="org__shared-grid">
              <div class="org__shared-item" *ngFor="let service of sharedServices">
                <strong>{{ service.name }}</strong>
                <span>{{ service.desc }}</span>
              </div>
            </div>
          </div>
        </figure>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow" appReveal="up">The units</span>
          <h2 appReveal="mask" [appRevealDelay]="70">Four specialist technology units</h2>
          <p appReveal="mask" [appRevealDelay]="150">
            Each unit owns its market, its customers and its
            domain expertise — and answers for its own numbers.
          </p>
        </div>

        <div class="grid grid--2">
          <article
            class="vertical-card"
            *ngFor="let business of businesses; let i = index"
            [style.--accent]="business.accent"
            appReveal="up"
            [appRevealDelay]="i * 80"
          >
            <div class="vertical-card__mark" aria-hidden="true">{{ business.mark }}</div>
            <div class="vertical-card__body">
              <span class="vertical-card__descriptor">{{ business.descriptor }}</span>
              <h3>{{ business.name }}</h3>
              <p>{{ business.blurb }}</p>
            </div>
            <span class="vertical-card__tag" aria-hidden="true"></span>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow" appReveal="up">Shared services</span>
          <h2 appReveal="mask" [appRevealDelay]="70">Built once, used by all</h2>
          <p appReveal="mask" [appRevealDelay]="150">
            Nothing below is reinvented per unit. It is the reason
            a four-unit group can move like a single team.
          </p>
        </div>

        <div class="grid grid--3">
          <article
            class="shared-card"
            *ngFor="let service of sharedServices; let i = index"
            appReveal="up"
            [appRevealDelay]="i * 60"
          >
            <div class="shared-card__icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <use [attr.href]="'#icon-' + service.icon"></use>
              </svg>
            </div>
            <h3>{{ service.name }}</h3>
            <p>{{ service.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container cta__inner">
        <div>
          <h2 appReveal="mask">Contact us with the whole group</h2>
          <p appReveal="mask" [appRevealDelay]="90">
            One inquiry gives you access to every unit and
            every shared service above.
          </p>
        </div>
        <a routerLink="/contact" class="btn btn--light" appReveal="left" [appRevealDelay]="200">Contact Us</a>
      </div>
    </section>

    <svg aria-hidden="true" style="position: absolute; width: 0; height: 0;">
      <symbol id="icon-engineering" viewBox="0 0 24 24">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </symbol>
      <symbol id="icon-cloud" viewBox="0 0 24 24">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
      </symbol>
      <symbol id="icon-data" viewBox="0 0 24 24">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </symbol>
      <symbol id="icon-security" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </symbol>
      <symbol id="icon-strategy" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </symbol>
      <symbol id="icon-shared" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </symbol>
    </svg>
  `,
  styleUrl: './structure.component.scss',
})
export class StructureComponent {
  readonly businesses: OtuyaBusiness[] = businesses;
  readonly sharedServices: SharedService[] = [
    { name: 'Engineering & Delivery', desc: 'One delivery method and one codebase standard across the group.', icon: 'engineering' },
    { name: 'Data & AI', desc: 'A common data platform and analytics capability.', icon: 'data' },
    { name: 'Security & Compliance', desc: 'One security baseline and audit posture for every unit.', icon: 'security' },
    { name: 'Strategy & Advisory', desc: 'Shared leadership, governance and investment decisions.', icon: 'strategy' },
    { name: 'Business Services', desc: 'Finance, HR and legal run once for the whole group.', icon: 'shared' },
  ];
}
