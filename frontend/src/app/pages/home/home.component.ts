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
import { VantaBackgroundComponent } from '../../shared/vanta-background/vanta-background.component';
import { ProcessStep, Service, SiteSettings, Testimonial, Project, Post, Paginated } from '../../core/models';

const MOCK_SERVICES: Service[] = [
  { id: 1, title: 'Digital Transformation', slug: 'digital-transformation', summary: 'End-to-end transformation programs that align people, process, and technology around measurable business outcomes.', body: '', icon: 'strategy', image: '/images/real/cloud-architecture.svg', highlights: null, sort_order: 1, is_featured: true, is_active: true },
  { id: 2, title: 'Custom Software Development', slug: 'custom-software-development', summary: 'Product-minded engineering teams delivering scalable, maintainable software — from greenfield products to platform modernization.', body: '', icon: 'code', image: '/images/real/coding-session.svg', highlights: null, sort_order: 2, is_featured: true, is_active: true },
  { id: 3, title: 'ERP Implementation', slug: 'erp-implementation', summary: 'Proven methodology for ERP deployments that minimize risk, accelerate time-to-value, and ensure user adoption.', body: '', icon: 'erp', image: '/images/solutions/erp-supply-chain.png', highlights: null, sort_order: 3, is_featured: true, is_active: true },
  { id: 4, title: 'Cloud Migration', slug: 'cloud-migration', summary: 'Structured migration programs that reduce cost, improve resilience, and unlock cloud-native capabilities.', body: '', icon: 'cloud', image: '/images/real/server-room.svg', highlights: null, sort_order: 4, is_featured: false, is_active: true },
  { id: 5, title: 'Vertical Solutions', slug: 'vertical-solutions', summary: 'Industry-specific platforms and accelerators for financial services, healthcare, manufacturing, retail, public sector, and energy.', body: '', icon: 'products', image: '/images/real/data-pipeline.svg', highlights: null, sort_order: 5, is_featured: false, is_active: true },
];

const MOCK_PROCESS_STEPS: ProcessStep[] = [
  { id: 1, step_number: 1, title: 'Discover & Align', slug: 'discover-align', summary: 'Stakeholder interviews, value-stream mapping, and outcome-based OKR definition.', body: '', icon: null, image: '/images/real/video-call.svg', sort_order: 1, is_active: true },
  { id: 2, step_number: 2, title: 'Architect & Plan', slug: 'architect-plan', summary: 'Target architecture, migration waves, risk register, and investment business case.', body: '', icon: null, image: '/images/real/coding-session.svg', sort_order: 2, is_active: true },
  { id: 3, step_number: 3, title: 'Foundations First', slug: 'foundations-first', summary: 'Landing zone, identity, observability, and CI/CD platform — the prerequisite layer.', body: '', icon: null, image: '/images/real/cloud-architecture.svg', sort_order: 3, is_active: true },
  { id: 4, step_number: 4, title: 'Migrate & Modernize', slug: 'migrate-modernize', summary: 'Workload-by-workload execution with automated validation and rollback capability.', body: '', icon: null, image: '/images/real/server-room.svg', sort_order: 4, is_active: true },
  { id: 5, step_number: 5, title: 'Operate & Optimize', slug: 'operate-optimize', summary: 'SLO-driven operations, FinOps discipline, and continuous architecture evolution.', body: '', icon: null, image: '/images/real/data-pipeline.svg', sort_order: 5, is_active: true },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, LazyImageDirective, CounterDirective, RevealDirective, VantaBackgroundComponent],
  template: `
    <section class="hero parallax-container">
      <app-vanta-bg effect="WAVES" [color]="vantaColor" [backgroundColor]="vantaBgColor" [options]="vantaOptions"></app-vanta-bg>
      <div class="hero__bg" appReveal="blur"></div>
      <div class="decorative-orb decorative-orb--pink" style="top: -100px; right: -80px; width: 320px; height: 320px;"></div>
      <div class="decorative-orb decorative-orb--teal" style="bottom: -120px; left: -100px; width: 280px; height: 280px;"></div>
      <div class="hero__decoration parallax-fast" appReveal="blur" [appRevealDelay]="100"></div>
      <div class="container hero__grid">
        <div>
          <span class="eyebrow eyebrow--light" appReveal="mask">Technology & Business Group</span>
          <h1 appReveal="mask" [appRevealDelay]="70">We build POS, apps, websites, ERP. Technology solutions for modern businesses.</h1>
          <p class="hero__lead" appReveal="mask" [appRevealDelay]="150">
            Otuya Global delivers custom software — POS systems, mobile apps, web platforms, ERP implementations.
            Senior engineering teams, delivery-focused, accountable to outcomes.
          </p>
          <div class="hero__actions" appReveal="mask" [appRevealDelay]="230">
            <a routerLink="/contact" class="btn btn--light hero__cta">Contact Us</a>
            <a routerLink="/services" class="btn btn--ghost hero__ghost hero__cta">View services</a>
          </div>

          <div class="hero__orders" appReveal="up" [appRevealDelay]="300">
            <a [routerLink]="['/contact']" [queryParams]="{ type: 'pos' }" class="btn btn--outline btn--sm hero__order-btn">POS System</a>
            <a [routerLink]="['/contact']" [queryParams]="{ type: 'apps' }" class="btn btn--outline btn--sm hero__order-btn">Mobile App</a>
            <a [routerLink]="['/contact']" [queryParams]="{ type: 'websites' }" class="btn btn--outline btn--sm hero__order-btn">Web Platform</a>
            <a [routerLink]="['/contact']" [queryParams]="{ type: 'erp' }" class="btn btn--outline btn--sm hero__order-btn">ERP Implementation</a>
          </div>
        </div>

        <div class="stats-bar" appReveal="blur" [appRevealDelay]="200">
          <div class="stat float-smooth" style="animation-delay: 0ms;">
            <strong [appCounter]="stats()?.services_offered ?? 0" [duration]="1800" [delay]="100" [easing]="'easeOut'">{{ stats()?.services_offered ?? '--' }}</strong>
            <span>Service lines</span>
          </div>
          <div class="stat float-smooth" style="animation-delay: 200ms;">
            <strong [appCounter]="stats()?.team_members ?? 0" [duration]="1800" [delay]="250" [easing]="'easeOut'">{{ stats()?.team_members ?? '--' }}</strong>
            <span>Team members</span>
          </div>
          <div class="stat float-smooth" style="animation-delay: 400ms;">
            <strong>4</strong>
            <span>Business units</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">What we do</span>
          <h2>Core Solutions</h2>
          <p>Five service lines — from strategy to operations. Each is delivered by senior teams who stay accountable to the outcome.</p>
        </div>

        <div class="services-grid">
          <article class="service-card" *ngFor="let service of services().slice(0, 3); let i = index" appReveal="up" [appRevealDelay]="i * 70">
            <h3><a [routerLink]="['/services/' + service.slug]">{{ service.title }}</a></h3>
            <p>{{ service.summary }}</p>
          </article>
        </div>

        <div class="center">
          <a routerLink="/services" class="btn btn--primary">View all services →</a>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow" appReveal="up">Solutions at a glance</span>
          <h2 appReveal="mask" [appRevealDelay]="70">ERP, POS, and mobile app platforms</h2>
          <p appReveal="mask" [appRevealDelay]="150">Technology solutions built for modern businesses — from enterprise resource planning to point-of-sale and mobile apps.</p>
        </div>

        <div class="solutions-grid">
          <div class="solution-item" appReveal="up" [appRevealDelay]="0">
            <div class="solution-item__media">
              <img src="/images/solutions/erp-supply-chain.png" alt="ERP systems for supply chain management" loading="lazy" />
            </div>
            <h3>ERP <br/>Implementation</h3>
            <p>End-to-end ERP deployments that minimize risk and accelerate time-to-value.</p>
          </div>
          <div class="solution-item" appReveal="up" [appRevealDelay]="80">
            <div class="solution-item__media">
              <img src="/images/solutions/pos-software.png" alt="Point of Sale (POS) software" loading="lazy" />
            </div>
            <h3>POS <br/>Systems</h3>
            <p>Custom point-of-sale platforms built for retail, hospitality, and field operations.</p>
          </div>
          <div class="solution-item" appReveal="up" [appRevealDelay]="160">
            <div class="solution-item__media">
              <img src="/images/solutions/apps-photo.jpg" alt="Mobile app development" loading="lazy" />
            </div>
            <h3>Mobile <br/>Applications</h3>
            <p>iOS and Android apps that deliver seamless experiences across devices.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--dark process">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow eyebrow--light">How we work</span>
          <h2>Our Engagement Process</h2>
          <p>Five phases, no surprises. We start from the outcome and work backwards.</p>
        </div>

        <ol class="process-grid">
          <li class="process-step" *ngFor="let step of processSteps().slice(0, 3); let i = index" appReveal="up" [appRevealDelay]="i * 70">
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

    <section class="section section--dark" *ngIf="testimonials().length">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow eyebrow--light">Client feedback</span>
          <h2>What our clients say</h2>
        </div>

        <div class="testimonials-grid">
          <blockquote class="testimonial" *ngFor="let item of testimonials(); let i = index" appReveal="up" [appRevealDelay]="i * 90">
            <p>"{{ item.quote }}"</p>
            <footer>
              <strong>{{ item.author_name }}</strong>
              <span>{{ item.author_role }}<ng-container *ngIf="item.author_company">, {{ item.author_company }}</ng-container></span>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>

    <section class="section" *ngIf="featuredProjects().length">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow" appReveal="up">Projects</span>
          <h2 appReveal="mask" [appRevealDelay]="70">Featured work</h2>
          <p appReveal="mask" [appRevealDelay]="150">Real problems we solved for real businesses — technology solutions that deliver results.</p>
        </div>

        <div class="projects-grid">
          <a
            class="project-card"
            *ngFor="let project of featuredProjects(); let i = index"
            [routerLink]="['/projects/' + project.slug]"
            appReveal="up"
            [appRevealDelay]="i * 80"
          >
            <span class="project-card__badge" *ngIf="project.is_featured">Featured</span>
            <h3>{{ project.title }}</h3>
            <p>{{ project.summary }}</p>
            <span class="project-card__more">Learn more →</span>
          </a>
        </div>
      </div>
    </section>

    <section class="section section--muted" *ngIf="featuredPosts().length">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow" appReveal="up">Insights</span>
          <h2 appReveal="mask" [appRevealDelay]="70">What we've learned</h2>
          <p appReveal="mask" [appRevealDelay]="150">Lessons from building software and delivering technology solutions across industries.</p>
        </div>

        <div class="insights-grid">
          <a
            class="insight-card"
            *ngFor="let post of featuredPosts(); let i = index"
            [routerLink]="['/insights/' + post.slug]"
            appReveal="up"
            [appRevealDelay]="i * 80"
          >
            <img *ngIf="post.image" [src]="post.image" [alt]="post.title" loading="lazy" />
            <div class="insight-card__body">
              <h3>{{ post.title }}</h3>
              <p class="excerpt">{{ post.excerpt || (post.body.substring(0, 120) + '...') }}</p>
              <span class="insight-card__more">Read on →</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container cta__inner">
        <h2>Have a problem worth solving?</h2>
        <p>Get in touch and we'll get back to you with a proposal.</p>
        <a routerLink="/contact" class="btn btn--primary">Contact Us</a>
      </div>
    </section>
  `,
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly api = inject(ApiService);
  readonly config = inject(APP_CONFIG);

  readonly vantaColor = 0xec4899;
  readonly vantaBgColor = 0x0f172a;
  readonly vantaOptions = { shininess: 50, waveHeight: 15, waveSpeed: 0.4 };

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