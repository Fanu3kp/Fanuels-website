import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../../core/api.service';
import { APP_CONFIG } from '../../../environments/app-config.model';
import { LazyImageDirective } from '../../shared/lazy-image/lazy-image.directive';
import { CounterDirective } from '../../shared/counter/counter.directive';
import { RevealDirective } from '../../shared/reveal/reveal.directive';
import { ProcessStep, Service, SiteSettings, Testimonial, Project, Post, Paginated } from '../../core/models';

const MOCK_SERVICES: Service[] = [
  { id: 1, title: 'Digital Transformation', slug: 'digital-transformation', summary: 'End-to-end transformation programs that align people, process, and technology around measurable business outcomes.', body: '', icon: 'strategy', image: '/images/real/cloud-architecture.svg?v=4', highlights: null, sort_order: 1, is_featured: true, is_active: true },
  { id: 2, title: 'Custom Software Development', slug: 'custom-software-development', summary: 'Product-minded engineering teams delivering scalable, maintainable software — from greenfield products to platform modernization.', body: '', icon: 'code', image: '/images/real/coding-session.svg?v=4', highlights: null, sort_order: 2, is_featured: true, is_active: true },
  { id: 3, title: 'ERP Implementation', slug: 'erp-implementation', summary: 'Proven methodology for ERP deployments that minimize risk, accelerate time-to-value, and ensure user adoption.', body: '', icon: 'erp', image: '/images/solutions/erp-supply-chain.jpg?v=4', highlights: null, sort_order: 3, is_featured: true, is_active: true },
  { id: 4, title: 'Cloud Migration', slug: 'cloud-migration', summary: 'Structured migration programs that reduce cost, improve resilience, and unlock cloud-native capabilities.', body: '', icon: 'cloud', image: '/images/real/server-room.svg?v=4', highlights: null, sort_order: 4, is_featured: false, is_active: true },
  { id: 5, title: 'Vertical Solutions', slug: 'vertical-solutions', summary: 'Industry-specific platforms and accelerators for financial services, healthcare, manufacturing, retail, public sector, and energy.', body: '', icon: 'products', image: '/images/real/vertical-hero.jpg?v=4', highlights: null, sort_order: 5, is_featured: false, is_active: true },
];

const MOCK_PROCESS_STEPS: ProcessStep[] = [
  { id: 1, step_number: 1, title: 'Discover & Align', slug: 'discover-align', summary: 'Stakeholder interviews, value-stream mapping, and outcome-based OKR definition.', body: '', icon: null, image: '/images/real/video-call.svg?v=4', sort_order: 1, is_active: true },
  { id: 2, step_number: 2, title: 'Architect & Plan', slug: 'architect-plan', summary: 'Target architecture, migration waves, risk register, and investment business case.', body: '', icon: null, image: '/images/real/coding-session.svg?v=4', sort_order: 2, is_active: true },
  { id: 3, step_number: 3, title: 'Foundations First', slug: 'foundations-first', summary: 'Landing zone, identity, observability, and CI/CD platform — the prerequisite layer.', body: '', icon: null, image: '/images/real/cloud-architecture.svg?v=4', sort_order: 3, is_active: true },
  { id: 4, step_number: 4, title: 'Migrate & Modernize', slug: 'migrate-modernize', summary: 'Workload-by-workload execution with automated validation and rollback capability.', body: '', icon: null, image: '/images/real/server-room.svg?v=4', sort_order: 4, is_active: true },
  { id: 5, step_number: 5, title: 'Operate & Optimize', slug: 'operate-optimize', summary: 'SLO-driven operations, FinOps discipline, and continuous architecture evolution.', body: '', icon: null, image: '/images/real/data-pipeline.svg?v=4', sort_order: 5, is_active: true },
];

@Component({
  selector: 'app-home',
  standalone: true,
   imports: [RouterLink, NgFor, NgIf, LazyImageDirective, CounterDirective, RevealDirective],
  template: `
    <section class="hero parallax-container fade-in">
      <div class="hero__orb hero__orb--1"></div>
      <div class="hero__orb hero__orb--2"></div>
      <div class="hero__grid">
        <div class="hero__copy">
          <span class="eyebrow eyebrow--light">Technology &amp; Business Group</span>
          <h1>We build POS, apps, websites, ERP.<br/><span class="hero__accent">Technology solutions for modern businesses.</span></h1>
          <p class="hero__lead">
            Otuya Global delivers custom software — POS systems, mobile apps, web platforms, ERP implementations.
            Senior engineering teams, delivery-focused, accountable to outcomes.
          </p>
          <div class="hero__actions">
            <a routerLink="/contact" class="btn btn--primary hero__cta">Contact Us</a>
            <a routerLink="/services" class="btn btn--ghost hero__ghost">View services</a>
          </div>

          <div class="hero__orders">
            <a [routerLink]="['/contact']" [queryParams]="{ type: 'pos' }" class="btn btn--outline btn--sm hero__order-btn">POS System</a>
            <a [routerLink]="['/contact']" [queryParams]="{ type: 'apps' }" class="btn btn--outline btn--sm hero__order-btn">Mobile App</a>
            <a [routerLink]="['/contact']" [queryParams]="{ type: 'websites' }" class="btn btn--outline btn--sm hero__order-btn">Web Platform</a>
            <a [routerLink]="['/contact']" [queryParams]="{ type: 'erp' }" class="btn btn--outline btn--sm hero__order-btn">ERP Implementation</a>
          </div>

          <div class="hero__stats">
            <div class="stats-bar">
              <div class="stat">
                <div class="stat-number">16+</div>
                <div class="stat-label">Projects delivered</div>
              </div>
              <div class="stat">
                <div class="stat-number">{{ stats()?.team_members || 14 }}</div>
                <div class="stat-label">Team members</div>
              </div>
              <div class="stat">
                <div class="stat-number">13</div>
                <div class="stat-label">Articles published</div>
              </div>
            </div>
          </div>
        </div>

        <div class="hero__visual">
          <div class="hero__visual-frame">
            <img src="/images/real/team-meeting.jpg" alt="Modern development team collaborating" loading="eager" decoding="async" />
          </div>
        </div>
      </div>
    </section>

    <section class="section fade-in">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">What we do</span>
          <h2>Core Solutions</h2>
          <p>Five service lines — from strategy to operations. Each is delivered by senior teams who stay accountable to the outcome.</p>
        </div>

        <div class="services-grid">
          <article class="service-card" *ngFor="let service of services().slice(0, 3); let i = index">
            <div class="service-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h3><a [routerLink]="['/services/' + service.slug]">{{ service.title }}</a></h3>
            <p>{{ service.summary }}</p>
          </article>
        </div>

        <div class="center">
          <a routerLink="/services" class="btn btn--primary">View all services →</a>
        </div>
      </div>
    </section>

    <section class="section section--muted fade-in">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Solutions at a glance</span>
          <h2>ERP, POS, and mobile app platforms</h2>
          <p>Technology solutions built for modern businesses — from enterprise resource planning to point-of-sale and mobile apps.</p>
        </div>

        <div class="solutions-grid">
          <div class="solution-item">
            <div class="solution-item__media">
              <img src="/images/solutions/erp-supply-chain.jpg?v=4" alt="ERP systems for supply chain management" loading="eager" decoding="async" />
            </div>
            <h3>ERP <br/>Implementation</h3>
            <p>End-to-end ERP deployments that minimize risk and accelerate time-to-value.</p>
          </div>
          <div class="solution-item">
            <div class="solution-item__media">
              <img src="/images/solutions/pos-software.jpg?v=4" alt="Point of Sale (POS) software" loading="eager" decoding="async" />
            </div>
            <h3>POS <br/>Systems</h3>
            <p>Custom point-of-sale platforms built for retail, hospitality, and field operations.</p>
          </div>
          <div class="solution-item">
            <div class="solution-item__media">
              <img src="/images/solutions/apps-photo.jpg?v=4" alt="Mobile app development" loading="eager" decoding="async" />
            </div>
            <h3>Mobile <br/>Applications</h3>
            <p>iOS and Android apps that deliver seamless experiences across devices.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--dark process fade-in">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow eyebrow--light">How we work</span>
          <h2>Our Engagement Process</h2>
          <p>Five phases, no surprises. We start from the outcome and work backwards.</p>
        </div>

        <ol class="process-grid">
          <li class="process-step" *ngFor="let step of processSteps().slice(0, 3); let i = index">
            <div class="process-num">{{ step.step_number }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.summary }}</p>
          </li>
        </ol>

        <div class="center">
          <a routerLink="/structure" class="btn btn--light">See our structure →</a>
        </div>
      </div>
    </section>

    <section class="section section--dark fade-in" *ngIf="testimonials().length">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow eyebrow--light">Client feedback</span>
          <h2>What our clients say</h2>
        </div>

        <div class="testimonials-grid">
          <blockquote class="testimonial" *ngFor="let item of testimonials(); let i = index">
            <p>"{{ item.quote }}"</p>
            <footer>
              <strong>{{ item.author_name }}</strong>
              <span>{{ item.author_role }}<ng-container *ngIf="item.author_company">, {{ item.author_company }}</ng-container></span>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>

    <section class="section section--muted fade-in" *ngIf="featuredPosts().length">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Insights</span>
          <h2>What we've learned</h2>
          <p>Lessons from building software and delivering technology solutions across industries.</p>
        </div>

        <div class="insights-grid">
          <a
            class="insight-card"
            *ngFor="let post of featuredPosts(); let i = index"
            [routerLink]="['/insights/' + post.slug]"
          >
            <img *ngIf="post.image" [src]="post.image" [alt]="post.title" loading="eager" decoding="async" />
            <div class="insight-card__body">
              <h3>{{ post.title }}</h3>
              <p class="excerpt">{{ post.excerpt || (post.body.substring(0, 120) + '...') }}</p>
              <span class="insight-card__more">Read on →</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="cta-premium light fade-in">
      <div class="container cta__inner">
        <div class="premium-head">
          <span class="premium-head__eyebrow">Ready to build?</span>
          <div class="premium-head__divider"></div>
          <h2>Have a problem worth solving?</h2>
          <p>Get in touch and we'll get back to you with a proposal.</p>
        </div>
        <a routerLink="/contact" class="btn btn--primary btn--lg">Contact Us</a>
      </div>
    </section>
  `,
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly api = inject(ApiService);
  readonly config = inject(APP_CONFIG);

  readonly settings = toSignal(this.api.settings().pipe(catchError(() => of({} as SiteSettings))), {
    initialValue: null,
  });

  readonly stats = toSignal(this.api.stats().pipe(catchError(() => of(null))), {
    initialValue: null,
  });

  readonly servicesFromApi = toSignal(
    this.api.services().pipe(catchError(() => of([] as Service[]))),
    { initialValue: [] as Service[] },
  );

  readonly services = computed(() => {
    const apiData = this.servicesFromApi();
    return apiData.length > 0 ? apiData : MOCK_SERVICES;
  });

  readonly processStepsFromApi = toSignal(
    this.api.process().pipe(catchError(() => of([] as ProcessStep[]))),
    { initialValue: [] as ProcessStep[] },
  );

  readonly processSteps = computed(() => {
    const apiData = this.processStepsFromApi();
    return apiData.length > 0 ? apiData : MOCK_PROCESS_STEPS;
  });

  readonly testimonialsFromApi = toSignal(
    this.api.testimonials().pipe(catchError(() => of([] as Testimonial[]))),
    { initialValue: [] as Testimonial[] },
  );

  readonly testimonials = computed(() => this.testimonialsFromApi());

  readonly projectsFromApi = toSignal(
    this.api.projects(6, true).pipe(catchError(() => of({ data: [] as Project[], current_page: 1, last_page: 1, per_page: 6, total: 0, links: [] } as Paginated<Project>))),
    {
      initialValue: { data: [] } as unknown as Paginated<Project>,
    },
  );

  readonly featuredProjects = computed(() => this.projectsFromApi().data.slice(0, 3));

  readonly postsFromApi = toSignal(
    this.api.posts({ featured: 'true', per_page: '4' }).pipe(catchError(() => of({ data: [] as Post[], current_page: 1, last_page: 1, per_page: 4, total: 0, links: [] } as Paginated<Post>))),
    {
      initialValue: { data: [] } as unknown as Paginated<Post>,
    },
  );

  readonly featuredPosts = computed(() => this.postsFromApi().data.slice(0, 3));
}







