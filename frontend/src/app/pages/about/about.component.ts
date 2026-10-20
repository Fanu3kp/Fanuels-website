import { Component, inject, computed } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { TeamMember, Testimonial, HomeStats } from '../../core/models';
import { PageHeroComponent } from '../../shared/page-hero/page-hero.component';

interface ValueItem {
  title: string;
  desc: string;
  icon: string;
}

interface TimelineItem {
  year: string;
  title: string;
  desc: string;
}

interface MissionItem {
  title: string;
  desc: string;
  icon: string;
}

  const MOCK_TEAM: TeamMember[] = [
  {
    id: 1,
    name: 'Fanuel Otuya',
    role: 'Founder & Chief Executive Officer',
    bio: 'Founder & CEO of Otuya Global...',
    image: '/images/team/fanuel-otuya.svg',
    email: null,
    linkedin_url: null,
    x_url: null,
    sort_order: 1,
    is_active: true,
  },
  {
    id: 2,
    name: 'Loyce Wanjiru',
    role: 'Project Manager',
    bio: 'Monitors all projects in this organisation hence ensure every task is completed on time',
    image: '/images/team/naledi-khumalo.svg',
    email: null,
    linkedin_url: null,
    x_url: null,
    sort_order: 2,
    is_active: true,
  },
  {
    id: 3,
    name: 'John Weche',
    role: 'Finance Officer',
    bio: 'He is a System software developer',
    image: '/images/team/john-doe.svg',
    email: null,
    linkedin_url: null,
    x_url: null,
    sort_order: 3,
    is_active: true,
  },
  {
    id: 4,
    name: 'Daniel Owino',
    role: 'HR',
    bio: 'Directs and Manages human Resources',
    image: '/images/team/sipho-ndlovu.svg',
    email: null,
    linkedin_url: null,
    x_url: null,
    sort_order: 4,
    is_active: true,
  },
];

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    author_name: 'Wanjiru Kariuki',
    author_role: 'Operations Director',
    author_company: 'SwiftStop Retail',
    quote: 'Otuya delivered a POS system that cut our checkout time by half. The team stayed on schedule and explained every decision.',
    avatar: null,
    rating: 5,
    sort_order: 1,
    is_active: true,
  },
  {
    id: 2,
    author_name: 'David Ochieng',
    author_role: 'IT Lead',
    author_company: 'MediCore Health',
    quote: 'The cloud migration was handled with real care for downtime. We hit zero incidents on cutover day.',
    avatar: null,
    rating: 5,
    sort_order: 2,
    is_active: true,
  },
  {
    id: 3,
    author_name: 'Sarah Njeri',
    author_role: 'CEO',
    author_company: 'Benga Studios',
    quote: 'Working with the advisory team felt like having a co-founder for the technical parts of our digital strategy.',
    avatar: null,
    rating: 4,
    sort_order: 3,
    is_active: true,
  },
];

const MOCK_STATS: HomeStats = {
  projects_completed: 120,
  services_offered: 12,
  team_members: 65,
  articles_published: 48,
};

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    RouterLink,
    PageHeroComponent,
  ],
  template: `
    <app-page-hero
      eyebrow="About Otuya Global"
      title="We build technology that stays accountable to your outcomes ✨"
      subtitle="A technology and business group delivering measurable results across software, systems, cloud, and advisory."
      backgroundImage="/images/backgrounds/about-bg.svg"
    />

    <section class="section">
      <div class="container about__stats">
        <div class="stat-card-premium" *ngFor="let s of statsItems()">
          <div class="stat-number-premium">{{ s.value }}</div>
          <div class="stat-label-premium">{{ s.label }}</div>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="container split">
        <div class="split__copy">
          <span class="eyebrow">Our story</span>
          <h2>Founded by Fanuel Otuya — engineer turned builder</h2>
          <p>
            Otuya Global was founded on one observation: most technology projects succeed or fail
            before code is written. After more than a decade leading engineering teams across
            fintech, healthcare, and enterprise software, Fanuel Otuya set out to build a group
            where every unit shares one engineering rigor — cloud, data, security, and finance —
            while each unit owns its market, customers, and numbers.
          </p>
          <div class="split__actions">
            <a routerLink="/structure" class="btn btn--primary btn--sm">See our structure</a>
          </div>
        </div>

        <ol class="timeline">
          <li
            class="timeline-item"
            *ngFor="let item of timeline; let i = index"
          >
            <span class="timeline-item__year">{{ item.year }}</span>
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="section section--muted">
      <div class="container">
        <div class="section-head premium-head">
          <span class="eyebrow premium-head__eyebrow">Our compass</span>
          <div class="premium-head__divider"></div>
          <h2>Mission, Vision & Goals</h2>
          <p>The north star that guides every decision, every project, and every partnership.</p>
        </div>

        <div class="grid grid--3">
          <article
            class="value-card"
            *ngFor="let item of missionItems; let i = index"
          >
            <div class="value-card__icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <use [attr.href]="'#mvv-' + item.icon"></use>
              </svg>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Guiding principles</span>
          <h2>How we work, in practice</h2>
          <p>The same principles guide every business unit and every shared service.</p>
        </div>

        <div class="grid grid--3">
          <article
            class="value-card"
            *ngFor="let value of values; let i = index"
          >
            <div class="value-card__icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <use [attr.href]="'#val-' + value.icon"></use>
              </svg>
            </div>
            <h3>{{ value.title }}</h3>
            <p>{{ value.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--dark">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow eyebrow--light">The team</span>
          <h2>Leadership across the group</h2>
          <p>Senior leaders who own their domains end to end.</p>
        </div>

        <div class="grid grid--3">
          <article
            class="team-card"
            *ngFor="let member of team(); let i = index"
          >
            <div class="team-card__avatar" aria-hidden="true">
              <img
                *ngIf="member.image"
                [src]="member.image"
                [alt]="member.name"
                loading="lazy"
                decoding="async"
              />
              <span
                *ngIf="!member.image"
                class="team-card__initials"
                >{{ initials(member.name) }}</span
              >
            </div>
            <h3>{{ member.name }}</h3>
            <span class="team-card__role">{{ member.role }}</span>
            <p class="team-card__bio">{{ member.bio }}</p>
            <div class="team-card__links">
              <a
                *ngIf="member.linkedin_url"
                [href]="member.linkedin_url"
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
                (click)="$event.preventDefault(); openExternal(member.linkedin_url)"
              ></a
              >
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Client feedback</span>
          <h2>What our clients say</h2>
          <p>We measure success by outcomes delivered, not hours billed.</p>
        </div>

        <div class="grid grid--3">
          <blockquote
            class="testimonial"
            *ngFor="let item of testimonials(); let i = index"
          >
            <p class="testimonial__quote">{{ item.quote }}</p>
            <footer class="testimonial__footer">
              <strong>{{ item.author_name }}</strong>
              <span>{{ item.author_role }}<ng-container *ngIf="item.author_company">, {{ item.author_company }}</ng-container></span>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container cta__inner">
        <div>
          <h2>Ready to build something that works?</h2>
          <p>One conversation gives you access to every business unit and the shared engineering layer behind them.</p>
        </div>
        <a routerLink="/contact" class="btn btn--light">Contact Us</a>
      </div>
    </section>

    <svg aria-hidden="true" style="position: absolute; width: 0; height: 0;">
      <symbol id="val-strategy" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </symbol>
      <symbol id="val-delivery" viewBox="0 0 24 24">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
        <path d="M13 7V3h4v4m-4 0V7h4"/>
      </symbol>
      <symbol id="val-collab" viewBox="0 0 24 24">
        <path d="M17 21V5a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v16"/>
        <path d="M9 12h.01M15 12h.01M9 16h.01M15 16h.01M9 8h.01M15 8h.01"/>
        <path d="M18 21V9a3 3 0 0 1 3-3h.01"/>
      </symbol>
      <symbol id="val-quality" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4"/>
        <path d="M21 12c0 4.4-3.6 8-8 8a8.96 8.96 0 0 1-4.92-1.46L2 21l1.46-6.08A8.92 8.92 0 0 1 3 13c0-4.4 3.6-8 8-8s8 3.6 8 8z"/>
      </symbol>
      <symbol id="mvv-target" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
        <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </symbol>
      <symbol id="mvv-horizon" viewBox="0 0 24 24">
        <path d="M4 21h16M4 14h16M4 7h16" stroke="currentColor" stroke-width="2" fill="none"/>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
      </symbol>
      <symbol id="mvv-growth" viewBox="0 0 24 24">
        <path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M7 17l5-5 5 5" stroke="currentColor" stroke-width="2" fill="none"/>
      </symbol>
    </svg>
  `,
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  private readonly api = inject(ApiService);

  readonly stats = toSignal(this.api.stats().pipe(catchError(() => of(null))), {
    initialValue: null,
  });

  readonly statsItems = computed(() => [
    { value: this.stats()?.team_members || 14, label: 'Team members' },
    { value: 16, label: 'Projects delivered' },
    { value: this.stats()?.services_offered ?? '--', label: 'Service lines' },
    { value: 13, label: 'Articles published' },
  ]);

  readonly team = toSignal(
    this.api.team().pipe(
      catchError(() => of(MOCK_TEAM)),
      map(members => members.length > 0 ? members : MOCK_TEAM),
    ),
    { initialValue: MOCK_TEAM },
  );

  readonly testimonials = toSignal(
    this.api.testimonials().pipe(catchError(() => of(MOCK_TESTIMONIALS))),
    { initialValue: MOCK_TESTIMONIALS },
  );

  readonly values: ValueItem[] = [
    {
      title: 'Outcome first',
      desc: 'Every engagement is scoped to a measurable result, not a fixed scope of work.',
      icon: 'strategy',
    },
    {
      title: 'Delivery discipline',
      desc: 'One delivery method, one codebase standard, one review checklist across every unit.',
      icon: 'delivery',
    },
    {
      title: 'Shared excellence',
      desc: 'Engineering, cloud, security and finance run once for the group so nothing is reinvented.',
      icon: 'collab',
    },
    {
      title: 'Built to last',
      desc: 'Quality gates, automated testing and observability are never handed off to chance.',
      icon: 'quality',
    },
  ];

  readonly timeline: TimelineItem[] = [
    {
      year: 'Jan 2026',
      title: 'Otuya Software launches',
      desc: 'A small team shipping custom web applications and POS integrations for retail.',
    },
    {
      year: 'Mar 2026',
      title: 'Otuya Systems',
      desc: 'ERP and enterprise systems delivery expands into finance and healthcare.',
    },
    {
      year: 'Jun 2026',
      title: 'Otuya Cloud',
      desc: 'A dedicated cloud practice for migrations, platforms and managed services.',
    },
    {
      year: 'Sep 2026',
      title: 'Otuya Advisory',
      desc: 'Strategic advisory opens to guide digital transformation at the C-suite level.',
    },
    {
      year: 'Oct 2026',
      title: 'Otuya Global is formed',
      desc: 'The four technology units — Software, Systems, Cloud and Advisory — come together under one group, backed by a single shared engineering, data and security layer.',
    },
  ];

  readonly missionItems: MissionItem[] = [
    {
      title: 'Mission',
      desc: 'To build technology that delivers measurable business outcomes — not just code — by combining senior engineering rigor with deep domain expertise across every engagement.',
      icon: 'target',
    },
    {
      title: 'Vision',
      desc: 'To become the trusted technology partner for Africa\'s most ambitious companies, where every system we build becomes a competitive advantage for our clients.',
      icon: 'horizon',
    },
    {
      title: 'Goals',
      desc: 'Deliver 100% on-time project completion. Maintain 95%+ client retention. Build reusable platforms that cut delivery time by 40%. Grow each business unit to market leadership in its domain.',
      icon: 'growth',
    },
  ];

  initials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  openExternal(url: string | null): void {
    if (url) {
      window.open(url, '_blank', 'noopener');
    }
  }
}


