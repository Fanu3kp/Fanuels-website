import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../shared/page-hero/page-hero.component';
import { RevealDirective } from '../../shared/reveal/reveal.directive';
import { OtuyaBusiness, businessUrl, businesses } from '../../core/businesses';
import { Product, PRODUCTS, getProductsByCategory, formatKsh } from '../../core/products';

interface PlatformSection {
  id: string;
  label: string;
  heading: string;
  description: string;
  route: string;
  cta: string;
}

interface OrderOption {
  label: string;
  route: string;
  queryParams?: Record<string, string>;
  variant: 'primary' | 'ghost';
}

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, PageHeroComponent, RevealDirective],
  template: `
    <app-page-hero
      eyebrow="Business Units"
      title="Four specialist units, one shared engineering core"
      subtitle="Otuya Global operates four technology-focused business units — Software, Systems, Cloud, and Advisory. Each has its own commercial focus, all powered by one shared engineering and delivery layer."
      backgroundImage="images/backgrounds/section-bg.svg"
    />

    <nav class="platform-nav" aria-label="Business platform sections">
      <div class="container platform-nav__inner">
        <a *ngFor="let item of navItems" [href]="'#' + item.id">{{ item.label }}</a>
      </div>
    </nav>

    <section class="section section--first" id="business">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow" appReveal="up">Business Units</span>
          <h2 appReveal="mask" [appRevealDelay]="70">Specialist teams for every technology domain</h2>
          <p appReveal="mask" [appRevealDelay]="150">
            Every business unit keeps its own commercial team and domain expertise. Work with the unit that
            understands your challenge, and you still deal with one group for engineering, platforms and
            shared services.
          </p>
        </div>

        <div class="branches-grid">
          <article
            class="branch-card"
            *ngFor="let branch of branches; let i = index"
            [style.--branch-accent]="branch.accent"
            appReveal="up"
            [appRevealDelay]="i * 80"
          >
            <div class="branch-card__mark" aria-hidden="true">{{ branch.mark }}</div>
            <div class="branch-card__body">
              <span class="branch-card__descriptor">{{ branch.descriptor }}</span>
              <h3>{{ branch.name }}</h3>
              <p>{{ branch.blurb }}</p>
            </div>
            <div class="branch-card__actions">
              <a
                [routerLink]="['/contact']"
                [queryParams]="{ type: getOrderType(branch.key) }"
                class="btn btn--primary btn--sm"
              >
                Contact {{ branch.name }}
              </a>
            </div>
          </article>
        </div>

        <p class="branches-note" appReveal="up">
          Unit sites open in a new tab. In local development they resolve to each unit's own dev server.
        </p>
      </div>
    </section>

    <section class="section" id="orders">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow" appReveal="up">Contact Us</span>
          <h2 appReveal="mask" [appRevealDelay]="70">Engage the right team for your needs</h2>
          <p appReveal="mask" [appRevealDelay]="150">Select what you need and we'll route your request to the business unit or engineering team that handles it.</p>
        </div>

        <div class="orders-grid">
          <a
            *ngFor="let option of orderOptions; let i = index"
            [routerLink]="option.route"
            [queryParams]="option.queryParams"
            class="btn btn--{{ option.variant }} btn--lg order-btn"
            appReveal="up"
            [appRevealDelay]="i * 60"
          >
            {{ option.label }}
          </a>
        </div>
      </div>
    </section>

    <section class="section section--muted" id="services">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow" appReveal="up">Shared Services</span>
          <h2 appReveal="mask" [appRevealDelay]="70">Engineering capabilities every unit draws on</h2>
          <p appReveal="mask" [appRevealDelay]="150">The group runs engineering, cloud platforms and delivery method once, so each unit inherits it rather than reinventing it.</p>
        </div>

        <div class="pricing-tabs" appReveal="up">
          <div class="pricing-tab-nav" role="tablist">
            <button
              *ngFor="let cat of categories; let i = index"
              class="pricing-tab-btn"
              [class.active]="activeCategory === cat.id"
              (click)="activeCategory = cat.id"
              role="tab"
              [attr.aria-selected]="activeCategory === cat.id"
            >
              {{ cat.label }}
            </button>
          </div>

          <div class="pricing-tab-panel" *ngFor="let cat of categories" [class.active]="activeCategory === cat.id" role="tabpanel">
            <div class="pricing-grid">
              <article
                class="pricing-card"
                *ngFor="let product of getProductsByCategory(cat.id); let i = index"
                [class.popular]="product.popular"
                appReveal="up"
                [appRevealDelay]="i * 70"
              >
                <div class="pricing-card__header">
                  <h3>{{ product.name }}</h3>
                </div>
                <p class="pricing-card__desc">{{ product.description }}</p>
                <ul class="pricing-card__features">
                  <li *ngFor="let feature of product.features">{{ feature }}</li>
                </ul>
                <div class="pricing-card__actions">
                  <a
                    [routerLink]="['/contact']"
                    [queryParams]="{ type: product.id }"
                    class="btn btn--primary btn--block"
                  >
                    Contact Us
                  </a>
                </div>
                <div class="pricing-card__badge" *ngIf="product.popular">Most Popular</div>
              </article>
            </div>
          </div>
        </div>
      </div>
     </section>

    <section class="section section--muted" *ngFor="let section of sections; let i = index" [id]="section.id">
      <div class="container split" [class.split--flip]="i % 2 === 1">
        <div class="split__copy">
          <span class="eyebrow" appReveal="up">{{ section.label }}</span>
          <h2 appReveal="mask" [appRevealDelay]="70">{{ section.heading }}</h2>
          <p appReveal="mask" [appRevealDelay]="150">{{ section.description }}</p>
          <div class="split__actions" appReveal="up" [appRevealDelay]="230">
            <a [routerLink]="section.route" class="btn btn--primary btn--sm">{{ section.cta }}</a>
          </div>
        </div>

        <ul class="split__list">
          <li *ngFor="let point of pointsFor(section.id); let j = index" appReveal="right" [appRevealDelay]="j * 70">
            <span class="split__marker" aria-hidden="true"></span>
            <span>{{ point }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="cta">
      <div class="container cta__inner">
        <div>
          <h2 appReveal="mask">Not sure which unit fits?</h2>
          <p appReveal="mask" [appRevealDelay]="90">
            Describe the problem and we will point you at the business unit that handles it — or tell you honestly
            that the group is a better fit.
          </p>
        </div>
        <a routerLink="/contact" class="btn btn--light" appReveal="left" [appRevealDelay]="200">Contact Us</a>
      </div>
    </section>
  `,
  styleUrl: './branches.component.scss',
})
export class BranchesComponent {
  readonly branches: OtuyaBusiness[] = businesses;

  readonly navItems: { id: string; label: string }[] = [
    { id: 'business', label: 'Business Units' },
    { id: 'orders', label: 'Contact Us' },
    { id: 'services', label: 'Shared Services' },
  ];

  readonly orderOptions: OrderOption[] = [
    { label: 'POS System', route: '/contact', queryParams: { type: 'pos' }, variant: 'primary' },
    { label: 'Mobile App', route: '/contact', queryParams: { type: 'apps' }, variant: 'primary' },
    { label: 'Web Platform', route: '/contact', queryParams: { type: 'websites' }, variant: 'primary' },
    { label: 'ERP Implementation', route: '/contact', queryParams: { type: 'erp' }, variant: 'primary' },
    { label: 'Cloud Migration', route: '/contact', queryParams: { type: 'cloud' }, variant: 'ghost' },
    { label: 'Digital Transformation', route: '/contact', queryParams: { type: 'transformation' }, variant: 'ghost' },
  ];

  readonly categories: { id: Product['category']; label: string }[] = [
    { id: 'software', label: 'Software & Systems' },
  ];

  activeCategory: Product['category'] = 'software';

  readonly PRODUCTS = PRODUCTS;
  readonly getProductsByCategory = getProductsByCategory;
  readonly formatKsh = formatKsh;

  readonly sections: PlatformSection[] = [
    {
      id: 'services',
      label: 'Services',
      heading: 'Shared services every unit draws on',
      description:
        'The group runs engineering, cloud platforms and delivery method once, so each business inherits it rather than reinventing it.',
      route: '/services',
      cta: 'All Services',
    },
    {
      id: 'insights',
      label: 'Insights',
      heading: 'What the group has learned, written down',
      description:
        'Engineering and commercial lessons from delivery across the group, published so clients can read the reasoning rather than take it on trust.',
      route: '/insights',
      cta: 'All Insights',
    },
  ];

  private readonly sectionPoints: Record<string, string[]> = {
    services: [
      'ERP implementation and support',
      'Custom software development',
      'Digital transformation consulting',
      'Specialized vertical solutions',
    ],
    insights: [
      'Engineering practice and code quality',
      'Cloud migration and what actually blocks it',
      'Security architecture in practice',
      'Commercial side of technology decisions',
    ],
  };

  pointsFor(id: string): string[] {
    return this.sectionPoints[id] ?? [];
  }

  urlFor(branch: OtuyaBusiness): string {
    return businessUrl(branch);
  }

  getOrderType(key: string): string {
    const map: Record<string, string> = {
      software: 'websites',
      systems: 'pos',
      cloud: 'cloud',
      advisory: 'transformation',
    };
    return map[key] ?? 'other';
  }
}

