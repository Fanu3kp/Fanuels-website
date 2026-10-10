import { Component, inject, input, computed, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RevealDirective } from '../../shared/reveal/reveal.directive';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { LazyImageDirective } from '../../shared/lazy-image/lazy-image.directive';
import { Service } from '../../core/models';

interface ServiceFeature {
  title: string;
  description: string;
  icon: string;
}

interface TechItem {
  name: string;
  category: string;
}

const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    title: 'Digital Transformation',
    slug: 'digital-transformation',
    summary: 'End-to-end transformation programs that align people, process, and technology around measurable business outcomes.',
    body: `Digital transformation is not a technology project — it's a business strategy executed through technology. We help organizations navigate the complexity of modernizing legacy systems, adopting cloud-native architectures, and building data-driven cultures.

Our approach starts with understanding your strategic objectives, mapping value streams, and identifying the highest-impact opportunities. We then design a phased roadmap that balances quick wins with foundational investments.

Each engagement includes executive alignment workshops, architecture review boards, and change management programs designed to ensure adoption at every level of the organization.`,
    icon: 'strategy',
    image: '/images/real/cloud-architecture.svg',
    highlights: [
      'Outcome-based roadmap with measurable OKRs',
      'Legacy decomposition and API-first architecture',
      'Data platform modernization and AI enablement',
      'Security-by-design and compliance automation',
      'DevOps transformation and platform engineering',
      'Organizational change management and upskilling',
    ],
    sort_order: 1,
    is_featured: true,
    is_active: true,
  },
  {
    id: 2,
    title: 'Custom Software Development',
    slug: 'custom-software-development',
    summary: 'Product-minded engineering teams delivering scalable, maintainable software — from greenfield products to platform modernization.',
    body: `We build software that solves real problems. Our cross-functional teams work as an extension of your organization, bringing product thinking, technical excellence, and delivery discipline to every engagement.

Whether you're launching a new digital product, modernizing a critical platform, or augmenting internal capacity, we apply the same rigor: test-driven development, continuous delivery, architectural decision records, and production-grade observability from day one.

Our engineers are fluent across the modern stack — TypeScript/React/Next.js on the frontend, .NET/Java/Go on the backend, PostgreSQL/Redis for data, Kubernetes for orchestration — and we select the right tools for your context, not our preferences.`,
    icon: 'code',
    image: '/images/real/coding-session.svg',
    highlights: [
      'Product discovery and validated learning cycles',
      'Full-stack delivery: frontend, backend, mobile, infrastructure',
      'DevOps and platform engineering as standard',
      'Automated quality gates: unit, integration, contract, E2E',
      'Legacy modernization via strangler fig and DDD',
      'Knowledge transfer and team enablement built in',
    ],
    sort_order: 2,
    is_featured: true,
    is_active: true,
  },
  {
    id: 3,
    title: 'ERP Implementation',
    slug: 'erp-implementation',
    summary: 'Proven methodology for ERP deployments that minimize risk, accelerate time-to-value, and ensure user adoption.',
    body: `ERP implementations fail when they're treated as IT projects instead of business transformations. Our methodology centers on process excellence, data integrity, and organizational readiness — not just software configuration.

We partner with you from selection through stabilization, bringing deep expertise across SAP S/4HANA, Oracle Cloud ERP, and Microsoft Dynamics 365. Our template-based approach reduces implementation risk by up to 40% while preserving flexibility for your unique requirements.

Every engagement includes process mining for current-state analysis, automated data migration tooling, integration architecture for your ecosystem, and a 90-day hypercare program with SLA-backed support.`,
    icon: 'erp',
    image: '/images/real/cloud-server.jpg',
    highlights: [
      'Process mining and fit-gap analysis',
      'Industry templates for accelerated deployment',
      'Automated data migration with validation',
      'API-first integration layer for ecosystem connectivity',
      'Role-based training and digital adoption platform',
      '90-day hypercare with continuous optimization',
    ],
    sort_order: 3,
    is_featured: true,
    is_active: true,
  },
  {
    id: 4,
    title: 'Cloud Migration',
    slug: 'cloud-migration',
    summary: 'Structured migration programs that reduce cost, improve resilience, and unlock cloud-native capabilities.',
    body: `Moving to the cloud is easy. Migrating well — with controlled costs, maintained compliance, and zero business disruption — requires discipline and experience.

We assess every workload, model the economics, and design a wave plan that matches strategy to reality. Some applications lift-and-shift; others refactor to containers or serverless; a few retire entirely. We make those decisions with data, not dogma.

Our cloud foundation includes multi-account landing zones, policy-as-code governance, FinOps discipline, and GitOps delivery — so you're not just in the cloud, you're operating effectively in it.`,
    icon: 'cloud',
    image: '/images/real/server-room.svg',
    highlights: [
      'Workload profiling, dependency mapping, and TCO modeling',
      'Lift-and-shift, replatform, or refactor per workload',
      'Multi-account landing zone with security baseline',
      'Kubernetes and serverless with GitOps delivery',
      'Database migration services and replication strategies',
      'FinOps: continuous rightsizing and anomaly detection',
    ],
    sort_order: 4,
    is_featured: false,
    is_active: true,
  },
  {
    id: 5,
    title: 'Vertical Solutions',
    slug: 'vertical-solutions',
    summary: 'Industry-specific platforms and accelerators for financial services, healthcare, manufacturing, retail, public sector, and energy.',
    body: `Deep domain expertise differentiates generic technology from solutions that work in your regulatory and competitive context. We maintain dedicated practices for six verticals, each with reference architectures, compliance mappings, and pre-built integrations.

Financial Services: Core banking modernization, payments orchestration, regulatory reporting, open banking APIs.
Healthcare & Life Sciences: FHIR interoperability, clinical trial platforms, patient engagement, HIPAA/GDPR compliance.
Manufacturing & IoT: Digital twins, predictive maintenance, MES/ERP convergence, OT/IT security.
Retail & Commerce: Unified commerce, order management, personalization engines, supply chain visibility.
Public Sector: Citizen services, case management, open data platforms, WCAG accessibility.
Energy & Utilities: Smart grid analytics, asset performance management, decarbonization tracking, regulatory compliance.`,
    icon: 'products',
    image: '/images/real/data-pipeline.svg',
    highlights: [
      'Financial Services: Core banking, payments, regulatory reporting',
      'Healthcare: FHIR, clinical trials, patient engagement',
      'Manufacturing: Digital twins, predictive maintenance, OT security',
      'Retail: Unified commerce, OMS, personalization',
      'Public Sector: Citizen services, case management, open data',
      'Energy: Smart grid, asset management, decarbonization',
    ],
    sort_order: 5,
    is_featured: false,
    is_active: true,
  },
];

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, LazyImageDirective, RevealDirective],
  template: `
    <ng-container *ngIf="resolvedService() as svc; else loading">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero__bg" [style.background-image]="'url(' + svc.image + ')'"></div>
        <div class="container">
          <nav class="crumbs">
            <a routerLink="/services">Services</a>
            <span>/</span>
            <span>{{ svc.title }}</span>
          </nav>
          <span class="eyebrow eyebrow--light">{{ getCategory(svc.title) }}</span>
          <h1>{{ svc.title }}</h1>
          <p class="hero__lead">{{ svc.summary }}</p>
        </div>
      </section>

      <!-- Key Features -->
      <section class="section">
        <div class="container">
          <header class="section-head">
            <span class="eyebrow" appReveal="up">Capabilities</span>
            <h2 appReveal="mask" [appRevealDelay]="70">What we deliver</h2>
            <p appReveal="mask" [appRevealDelay]="150">Core capabilities included in every {{ svc.title.toLowerCase() }} engagement.</p>
          </header>

          <div class="grid grid--3">
              <article class="feature-card" *ngFor="let feature of features(); let i = index" appReveal="up" [appRevealDelay]="i * 70">
              <div class="feature-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <use [attr.href]="'#icon-' + feature.icon"></use>
                </svg>
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="section section--muted">
        <div class="container detail">
          <article class="detail__body">
            <figure class="detail__media" *ngIf="svc.image">
              <img [src]="svc.image" [alt]="svc.title" loading="lazy" appLazyImage />
            </figure>

            <div class="detail__content">
              <p *ngFor="let paragraph of bodyParagraphs()">{{ paragraph }}</p>

              <ng-container *ngIf="svc.highlights?.length">
                <h2>What this covers</h2>
                <ul class="checks">
                  <li *ngFor="let highlight of svc.highlights">{{ highlight }}</li>
                </ul>
              </ng-container>
            </div>
          </article>

          <aside class="detail__side">
            <div class="card">
              <h3>Discuss this service</h3>
              <p>Tell us about your situation and we will come back with a clear recommendation on scope and sequence.</p>
              <a routerLink="/contact" class="btn btn--primary btn--block">Contact Us</a>
            </div>

            <div class="card">
              <h3>Technology & Partners</h3>
              <div class="tech-partners" *ngIf="resolvedService()?.slug === 'erp-implementation'">
                <img src="/images/solutions/erp-business-central.svg" alt="Business Central ERP platform" class="tech-platform-img" />
              </div>
                <div class="tech-tags" *ngFor="let tech of technologies()">
                <span class="tech-tag" [attr.data-category]="tech.category">{{ tech.name }}</span>
              </div>
            </div>

            <div class="card">
              <h3>Related services</h3>
                <a *ngFor="let other of relatedServices()" [routerLink]="['/services', other.slug]" class="related">
                {{ other.title }}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <!-- Process / Approach -->
      <section class="section" *ngIf="process().length">
        <div class="container">
          <header class="section-head">
            <span class="eyebrow" appReveal="up">Our Approach</span>
            <h2 appReveal="mask" [appRevealDelay]="70">How we deliver {{ svc.title.toLowerCase() }}</h2>
            <p appReveal="mask" [appRevealDelay]="150">A structured, transparent process that reduces risk and accelerates value.</p>
          </header>

          <div class="process-timeline">
            <div class="process-step" *ngFor="let step of process(); let i = index">
              <div class="process-step__num">{{ i + 1 }}</div>
              <div class="process-step__content">
                <h3>{{ step.title }}</h3>
                <p>{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="section section--muted">
        <div class="container">
          <div class="cta-banner">
            <div class="cta-banner__content">
              <h2 appReveal="mask">Ready to message us about {{ svc.title.toLowerCase() }}?</h2>
              <p appReveal="mask" [appRevealDelay]="90">Book a free 30-minute discovery call. No sales pitch — just practical advice on your next steps.</p>
            </div>
            <a routerLink="/contact" class="btn btn--primary btn--lg" appReveal="up" [appRevealDelay]="190">Book discovery call</a>
          </div>
        </div>
      </section>

      <!-- SVG Icons -->
      <svg aria-hidden="true" style="position: absolute; width: 0; height: 0;">
        <symbol id="icon-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></symbol>
        <symbol id="icon-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></symbol>
        <symbol id="icon-zap" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></symbol>
        <symbol id="icon-users" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></symbol>
        <symbol id="icon-cloud" viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></symbol>
        <symbol id="icon-database" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></symbol>
        <symbol id="icon-code" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></symbol>
        <symbol id="icon-server" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="6" y1="6" x2="18" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/></symbol>
        <symbol id="icon-git" viewBox="0 0 24 24"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M11 18H8a2 2 0 0 1-2-2V9"/></symbol>
      </svg>
    </ng-container>

    <ng-template #loading>
      <div class="spinner" *ngIf="!notFound()"></div>
      <section class="notfound" *ngIf="notFound()">
        <div class="container notfound__inner">
          <h1>Service not found</h1>
          <p>We could not find a service at this address. It may have been renamed, or the link that brought you here may be out of date.</p>
          <div class="notfound__actions">
            <a routerLink="/services" class="btn btn--ghost">All services</a>
            <a routerLink="/contact" class="btn btn--primary">Contact us</a>
          </div>
        </div>
      </section>
    </ng-template>
  `,
  styles: [
    `
      /* Hero */
      .hero {
        position: relative;
        background: linear-gradient(120deg, var(--navy-900) 0%, var(--navy-700) 58%, var(--blue-600) 135%);
        color: #cbd5e1;
        padding: 90px 0 80px;
        overflow: hidden;
      }
      .hero__bg {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        opacity: 0.12;
        z-index: 0;
      }
      .hero .container { position: relative; z-index: 1; }
      .hero h1 { color: var(--white); margin-bottom: 14px; font-size: clamp(2rem, 5vw, 3rem); }
      .hero__lead { font-size: 1.15rem; max-width: 680px; margin: 0; color: #b6c6da; line-height: 1.7; }
      .crumbs { display: flex; gap: 9px; font-size: 0.85rem; margin-bottom: 22px; color: #93a5bd; }
      .crumbs a { color: #cbd5e1; transition: color var(--transition-fast); }
      .crumbs a:hover { color: var(--pink-400); }
      .eyebrow--light { color: var(--teal-400); }

      /* Section Head */
      .section-head { text-align: center; max-width: 720px; margin: 0 auto 48px; }
      .section-head .eyebrow { display: inline-block; margin-bottom: 10px; }
      .section-head h2 { margin-bottom: 12px; }
      .section-head p { color: var(--slate-600); font-size: 1.05rem; }

      /* Features Grid */
      .grid--3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
      .feature-card {
        background: var(--white);
        border: 1px solid var(--slate-200);
        border-radius: var(--radius-lg);
        padding: 32px 28px;
        transition: transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal);
      }
      .feature-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
        border-color: var(--pink-400);
      }
      .feature-card__icon {
        width: 48px; height: 48px;
        background: linear-gradient(135deg, var(--pink-500), var(--pink-600));
        border-radius: var(--radius-md);
        display: flex; align-items: center; justify-content: center;
        color: var(--white);
        margin-bottom: 16px;
      }
      .feature-card h3 { margin-bottom: 8px; font-size: 1.1rem; }
      .feature-card p { color: var(--slate-600); font-size: 0.95rem; line-height: 1.6; margin: 0; }

      /* Detail Section */
      .section--muted { background: var(--slate-50); }
      .detail { display: grid; grid-template-columns: 1.6fr 1fr; gap: 52px; align-items: start; }
      .detail__body p { color: var(--slate-700); line-height: 1.8; margin-bottom: 16px; }
      .detail__content h2 { margin: 32px 0 16px; font-size: 1.4rem; }
      .detail__content h2:first-child { margin-top: 0; }
      .detail__media { margin: 0 0 30px; }
      .detail__media img {
        width: 100%;
        height: auto;
        display: block;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow);
        transition: transform var(--transition-slow), box-shadow var(--transition-slow);
      }
      .detail__media img:hover {
        transform: scale(1.01);
        box-shadow: var(--shadow-xl);
      }
      .checks { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px; margin: 16px 0 24px; }
      .checks li { position: relative; padding-left: 30px; color: var(--slate-700); line-height: 1.6; }
      .checks li::before {
        content: '✓';
        position: absolute;
        left: 0;
        top: -1px;
        color: var(--green-600);
        font-weight: 700;
        font-size: 1.1rem;
      }

      /* Sidebar */
      .detail__side { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 96px; }
      .detail__side .card {
        background: var(--white);
        border: 1px solid var(--slate-200);
        border-radius: var(--radius-lg);
        padding: 24px;
      }
      .detail__side h3 { font-size: 1rem; margin-bottom: 12px; color: var(--navy-900); }
      .detail__side p { font-size: 0.92rem; color: var(--slate-500); margin-bottom: 16px; }
      .related {
        display: block;
        padding: 11px 0;
        border-bottom: 1px solid var(--slate-200);
        font-weight: 500;
        font-size: 0.93rem;
        color: var(--navy-700);
        transition: color var(--transition-fast), padding-left var(--transition-fast);
      }
      .related:hover { color: var(--pink-600); padding-left: 4px; }
      .related:last-child { border-bottom: 0; }

      /* Tech Tags */
      .tech-tags { display: flex; flex-wrap: wrap; gap: 8px; }
      .tech-tag {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 6px 12px;
        background: var(--slate-100);
        border-radius: var(--radius-full);
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--slate-700);
        transition: background var(--transition-fast), color var(--transition-fast);
      }
      .tech-tag:hover { background: var(--pink-100); color: var(--pink-700); }
      .tech-tag[data-category] { background: var(--pink-50); color: var(--pink-700); }
      .tech-tag:is(
        [data-category="Platform"], [data-category="Runtime"], [data-category="Integration"],
        [data-category="Control Plane"], [data-category="Industrial"], [data-category="IaC"],
        [data-category="Container"], [data-category="Orchestration"], [data-category="Data"],
        [data-category="Analytics"], [data-category="Database"], [data-category="IoT"],
        [data-category="Streaming"], [data-category="Time Series"], [data-category="Quality"],
        [data-category="Security"]
      ) { background: var(--teal-50); color: var(--teal-700); }
      .tech-tag:is(
        [data-category="Platform"], [data-category="Runtime"], [data-category="Integration"],
        [data-category="Control Plane"], [data-category="Industrial"], [data-category="IaC"],
        [data-category="Container"], [data-category="Orchestration"], [data-category="Data"],
        [data-category="Analytics"], [data-category="Database"], [data-category="IoT"],
        [data-category="Streaming"], [data-category="Time Series"], [data-category="Quality"],
        [data-category="Security"]
      ):hover { background: var(--teal-100); color: var(--teal-700); }

      .tech-partners {
        margin-bottom: 16px;
      }
      .tech-platform-img {
        width: 100%;
        height: 200px;
        object-fit: contain;
        filter: drop-shadow(0 4px 12px rgba(0,0,0,0.05));
        border-radius: var(--radius-md);
        opacity: 0.85;
        transition: opacity 0.3s ease;
      }
      .tech-platform-img:hover {
        opacity: 1;
        filter: drop-shadow(0 8px 24px rgba(0,120,212,0.15));
      }

      /* Process Timeline */
      .process-timeline { position: relative; max-width: 720px; margin: 0 auto; }
      .process-timeline::before {
        content: '';
        position: absolute;
        left: 24px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(180deg, var(--pink-400), var(--pink-600));
      }
      .process-step { position: relative; padding-left: 72px; margin-bottom: 40px; }
      .process-step:last-child { margin-bottom: 0; }
      .process-step__num {
        position: absolute;
        left: 0;
        top: 0;
        width: 48px; height: 48px;
        background: var(--white);
        border: 3px solid var(--pink-500);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-weight: 700;
        font-size: 1.1rem;
        color: var(--pink-600);
        z-index: 1;
      }
      .process-step__content h3 { margin-bottom: 6px; font-size: 1.15rem; }
      .process-step__content p { color: var(--slate-600); margin: 0; line-height: 1.6; }

      /* CTA Banner */
      .cta-banner {
        background: linear-gradient(135deg, var(--navy-900) 0%, var(--navy-700) 100%);
        border-radius: var(--radius-xl);
        padding: 48px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 24px;
        border: 1px solid rgba(45, 212, 191, 0.2);
      }
      .cta-banner__content h2 {
        color: var(--white);
        margin-bottom: 12px;
        font-size: clamp(1.5rem, 3.5vw, 2rem);
      }
      .cta-banner__content p {
        color: #b6c6da;
        max-width: 560px;
        margin: 0;
        font-size: 1.05rem;
      }
      .cta-banner .btn--primary {
        background: var(--pink-500);
        border-color: var(--pink-500);
        color: var(--navy-900);
      }
      .cta-banner .btn--primary:hover {
        background: var(--pink-400);
        border-color: var(--pink-400);
      }
      .btn--lg { padding: 14px 36px; font-size: 1rem; }
      .btn--block { width: 100%; text-align: center; }

      /* Not Found */
      .notfound { background: var(--slate-50); padding: 90px 0 100px; }
      .notfound__inner {
        max-width: 640px;
        background: var(--white);
        border: 1px solid var(--slate-200);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        padding: 48px 40px;
        text-align: center;
      }
      .notfound h1 { color: var(--navy-900); font-size: clamp(1.6rem, 4vw, 2.2rem); margin-bottom: 14px; }
      .notfound p { color: var(--slate-600); line-height: 1.7; margin: 0 auto 28px; max-width: 480px; }
      .notfound__actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

      /* Responsive */
      @media (max-width: 1024px) {
        .grid--3 { grid-template-columns: repeat(2, 1fr); }
        .detail { gap: 40px; }
      }
      @media (max-width: 900px) {
        .detail { grid-template-columns: 1fr; gap: 34px; }
        .detail__side { position: static; }
        .detail__side .card { display: none; }
        .detail__side .card:first-child { display: block; }
        .process-step { padding-left: 64px; }
        .process-step__num { width: 40px; height: 40px; font-size: 1rem; left: 4px; }
        .process-timeline::before { left: 22px; }
      }
      @media (max-width: 640px) {
        .grid--3 { grid-template-columns: 1fr; }
        .hero { padding: 70px 0 60px; }
        .cta-banner { padding: 32px 24px; }
        .notfound { padding: 60px 0 70px; }
        .notfound__inner { padding: 36px 24px; }
      }
    `,
  ],
})
export class ServiceDetailComponent {
  private readonly api = inject(ApiService);

  readonly slug = input.required<string>();

  readonly loaded = signal(false);

  readonly service = toSignal(
    toObservable(this.slug).pipe(
      switchMap((slug) => this.api.service(slug).pipe(catchError(() => of(null)))),
      tap(() => this.loaded.set(true)),
    ),
    { initialValue: null as Service | null },
  );

  private readonly allFromApi = toSignal(this.api.services().pipe(catchError(() => of([] as Service[]))), {
    initialValue: [] as Service[],
  });

  readonly all = computed(() => {
    const apiServices = this.allFromApi();
    return apiServices.length > 0 ? apiServices : MOCK_SERVICES;
  });

  readonly resolvedService = computed(() => {
    const fromApi = this.service();
    if (fromApi) return fromApi;
    return MOCK_SERVICES.find((s) => s.slug === this.slug()) ?? null;
  });

  readonly notFound = computed(() => this.loaded() && !this.resolvedService());

  /*
   * Template-facing collections. Each is a `computed` so it keeps a stable
   * reference until the resolved service changes. The underlying lookups build
   * fresh arrays on every call, and calling them directly inside `*ngFor`
   * alongside `appReveal` re-triggers change detection forever, which blocks
   * the renderer. Memoising breaks that cycle.
   */
  readonly features = computed(() => {
    const svc = this.resolvedService();
    return svc ? this.getFeaturesForService(svc) : [];
  });

  readonly technologies = computed(() => {
    const svc = this.resolvedService();
    return svc ? this.getTechnologiesForService(svc) : [];
  });

  readonly process = computed(() => {
    const svc = this.resolvedService();
    return svc ? this.getProcessForService(svc) : [];
  });

  readonly relatedServices = computed(() => {
    const svc = this.resolvedService();
    return svc ? this.related(svc) : [];
  });

  readonly bodyParagraphs = computed(() => {
    const svc = this.resolvedService();
    return svc ? this.paragraphs(svc.body) : [];
  });

  paragraphs(body: string | null): string[] {
    return (body ?? '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  }

  related(current: Service): Service[] {
    return this.all().filter((s) => s.id !== current.id).slice(0, 5);
  }

  getCategory(title: string): string {
    const categories: Record<string, string> = {
      'Digital Transformation': 'Transformation',
      'Custom Software Development': 'Development',
      'ERP Implementation': 'Enterprise',
      'Cloud Migration': 'Cloud',
      'Vertical Solutions': 'Industry',
    };
    return categories[title] || 'Service';
  }

  getFeaturesForService(svc: Service): ServiceFeature[] {
    const featureMap: Record<string, ServiceFeature[]> = {
      'Digital Transformation': [
        { title: 'Strategy & Roadmap', description: 'Align technology investments with business outcomes through structured discovery and prioritization.', icon: 'check' },
        { title: 'Change Management', description: 'People-first adoption programs that reduce resistance and accelerate time-to-value.', icon: 'users' },
        { title: 'Architecture Modernization', description: 'Decompose monoliths, introduce APIs, and establish governance for scalable systems.', icon: 'cloud' },
        { title: 'Data & AI Enablement', description: 'Unlock predictive insights with modern data platforms and responsible AI practices.', icon: 'database' },
        { title: 'Security by Design', description: 'Embed zero-trust principles and compliance into every layer of the transformation.', icon: 'shield' },
        { title: 'Continuous Delivery', description: 'Automate pipelines for faster, safer releases with built-in quality gates.', icon: 'zap' },
      ],
      'Custom Software Development': [
        { title: 'Product Discovery', description: 'Validate ideas through user research, prototyping, and measurable success criteria.', icon: 'check' },
        { title: 'Full-Stack Engineering', description: 'TypeScript, .NET, Java, Go — delivered by cross-functional feature teams.', icon: 'code' },
        { title: 'DevOps & Platform', description: 'Kubernetes, GitOps, observability — infrastructure as a competitive advantage.', icon: 'server' },
        { title: 'Quality Automation', description: 'Shift-left testing, contract testing, chaos engineering — confidence at speed.', icon: 'shield' },
        { title: 'Legacy Modernization', description: 'Strangler fig patterns, domain-driven design, incremental migration with zero downtime.', icon: 'cloud' },
        { title: 'Open Source Stewardship', description: 'Contribute upstream, manage dependencies, reduce vendor lock-in.', icon: 'git' },
      ],
      'ERP Implementation': [
        { title: 'Process Mining', description: 'Data-driven analysis of current-state workflows to identify high-impact improvement areas.', icon: 'check' },
        { title: 'Template-Based Deployment', description: 'Pre-configured industry templates reduce implementation risk by 40%.', icon: 'server' },
        { title: 'Data Migration & Cleansing', description: 'Automated tooling with human validation for master data integrity.', icon: 'database' },
        { title: 'Integration Layer', description: 'API-first connectivity to CRM, MES, e-commerce, and regulatory systems.', icon: 'cloud' },
        { title: 'User Enablement', description: 'Role-based training, digital adoption platforms, super-user networks.', icon: 'users' },
        { title: 'Post-Go-Live Stabilization', description: '90-day hypercare with SLA-backed support and continuous optimization.', icon: 'shield' },
      ],
      'Cloud Migration': [
        { title: 'Assessment & TCO Modeling', description: 'Workload profiling, dependency mapping, and cloud economics modeling.', icon: 'check' },
        { title: 'Lift & Shift vs Refactor', description: 'Pragmatic migration strategies per workload — not dogma.', icon: 'cloud' },
        { title: 'Landing Zone & Governance', description: 'Multi-account security baseline, policy-as-code, cost guardrails.', icon: 'shield' },
        { title: 'Kubernetes & Serverless', description: 'Modern runtime platforms with GitOps and progressive delivery.', icon: 'server' },
        { title: 'Data Gravity Management', description: 'Hybrid connectivity, database migration services, replication strategies.', icon: 'database' },
        { title: 'FinOps & Optimization', description: 'Continuous rightsizing, reserved instances, anomaly detection.', icon: 'zap' },
      ],
      'Vertical Solutions': [
        { title: 'Financial Services', description: 'Core banking modernization, payments, regulatory reporting, open banking.', icon: 'shield' },
        { title: 'Healthcare & Life Sciences', description: 'FHIR interoperability, clinical trials, patient engagement, HIPAA/GDPR.', icon: 'users' },
        { title: 'Manufacturing & IoT', description: 'Digital twins, predictive maintenance, MES/ERP convergence, OT/IT security.', icon: 'server' },
        { title: 'Retail & Commerce', description: 'Unified commerce, order management, personalization, supply chain visibility.', icon: 'cloud' },
        { title: 'Public Sector', description: 'Citizen services, case management, open data, accessibility compliance.', icon: 'check' },
        { title: 'Energy & Utilities', description: 'Smart grid, asset management, decarbonization analytics, regulatory compliance.', icon: 'zap' },
      ],
    };
    return featureMap[svc.title] || [
      { title: 'Expert Consultation', description: 'Senior architects guide your technology decisions from day one.', icon: 'check' },
      { title: 'Agile Delivery', description: 'Iterative increments with continuous feedback and course correction.', icon: 'zap' },
      { title: 'Knowledge Transfer', description: 'Your team owns the outcome — we build capability alongside solutions.', icon: 'users' },
    ];
  }

  getTechnologiesForService(svc: Service): TechItem[] {
    const techMap: Record<string, TechItem[]> = {
      'Digital Transformation': [
        { name: 'Azure', category: 'Cloud' }, { name: 'AWS', category: 'Cloud' }, { name: 'GCP', category: 'Cloud' },
        { name: 'Kubernetes', category: 'Platform' }, { name: 'Terraform', category: 'IaC' }, { name: 'ArgoCD', category: 'GitOps' },
        { name: 'Databricks', category: 'Data' }, { name: 'dbt', category: 'Data' }, { name: 'Great Expectations', category: 'Quality' },
      ],
      'Custom Software Development': [
        { name: 'TypeScript', category: 'Language' }, { name: '.NET 8', category: 'Framework' }, { name: 'Java 21', category: 'Language' },
        { name: 'Go', category: 'Language' }, { name: 'React', category: 'Frontend' }, { name: 'Next.js', category: 'Framework' },
        { name: 'Node.js', category: 'Runtime' }, { name: 'PostgreSQL', category: 'Database' }, { name: 'Redis', category: 'Cache' },
      ],
      'ERP Implementation': [
        { name: 'SAP S/4HANA', category: 'ERP' }, { name: 'Oracle Cloud ERP', category: 'ERP' }, { name: 'Microsoft Dynamics 365', category: 'ERP' },
        { name: 'Boomi', category: 'Integration' }, { name: 'MuleSoft', category: 'Integration' }, { name: 'Celigo', category: 'Integration' },
        { name: 'Snowflake', category: 'Data' }, { name: 'Power BI', category: 'Analytics' }, { name: 'Tableau', category: 'Analytics' },
      ],
      'Cloud Migration': [
        { name: 'AWS Migration Hub', category: 'Tooling' }, { name: 'Azure Migrate', category: 'Tooling' }, { name: 'Google Cloud Migrate', category: 'Tooling' },
        { name: 'Velero', category: 'Backup' }, { name: 'Istio', category: 'Service Mesh' }, { name: 'Crossplane', category: 'Control Plane' },
        { name: 'Karpenter', category: 'Autoscaling' }, { name: 'External Secrets', category: 'Security' }, { name: 'Kyverno', category: 'Policy' },
      ],
      'Vertical Solutions': [
        { name: 'FHIR', category: 'Standard' }, { name: 'HL7', category: 'Standard' }, { name: 'ISO 20022', category: 'Standard' },
        { name: 'OPC UA', category: 'Industrial' }, { name: 'MQTT', category: 'IoT' }, { name: 'Kafka', category: 'Streaming' },
        { name: 'TimescaleDB', category: 'Database' }, { name: 'InfluxDB', category: 'Time Series' }, { name: 'Grafana', category: 'Observability' },
      ],
    };
    return techMap[svc.title] || [
      { name: 'TypeScript', category: 'Language' }, { name: 'Node.js', category: 'Runtime' }, { name: 'PostgreSQL', category: 'Database' },
      { name: 'Docker', category: 'Container' }, { name: 'Kubernetes', category: 'Orchestration' },
    ];
  }

  getProcessForService(svc: Service): { title: string; description: string }[] {
    const processMap: Record<string, { title: string; description: string }[]> = {
      'Digital Transformation': [
        { title: 'Discover & Align', description: 'Stakeholder interviews, value-stream mapping, and outcome-based OKR definition.' },
        { title: 'Architect & Plan', description: 'Target architecture, migration waves, risk register, and investment business case.' },
        { title: 'Foundations First', description: 'Landing zone, identity, observability, and CI/CD platform — the prerequisite layer.' },
        { title: 'Migrate & Modernize', description: 'Workload-by-workload execution with automated validation and rollback capability.' },
        { title: 'Operate & Optimize', description: 'SLO-driven operations, FinOps discipline, and continuous architecture evolution.' },
      ],
      'Custom Software Development': [
        { title: 'Discovery & Framing', description: 'Event storming, user journey mapping, and measurable definition of done.' },
        { title: 'Architecture & Tech Selection', description: 'ADRs, threat modeling, and spike-driven technology validation.' },
        { title: 'Incremental Delivery', description: 'Two-week sprints, trunk-based development, feature flags, and automated quality gates.' },
        { title: 'Production Readiness', description: 'Load testing, chaos experiments, runbooks, and on-call rotation setup.' },
        { title: 'Evolve & Scale', description: 'Product analytics, A/B testing, technical debt budgets, and platform self-service.' },
      ],
      'ERP Implementation': [
        { title: 'Assess & Design', description: 'Process mining, fit-gap analysis, and target operating model definition.' },
        { title: 'Build & Configure', description: 'Template deployment, custom extensions, integration layer, and data prep.' },
        { title: 'Validate & Test', description: 'UAT scripts, performance benchmarks, security scanning, and cutover rehearsal.' },
        { title: 'Deploy & Enable', description: 'Phased go-live, super-user support, digital adoption platform, and hypercare.' },
        { title: 'Optimize & Extend', description: 'Process mining feedback loop, continuous improvement backlog, and innovation sprints.' },
      ],
      'Cloud Migration': [
        { title: 'Assess & Prioritize', description: 'Workload discovery, dependency mapping, TCO modeling, and wave planning.' },
        { title: 'Foundation & Governance', description: 'Landing zone, security baseline, cost policies, and operational playbooks.' },
        { title: 'Migrate Wave by Wave', description: 'Rehost, replatform, or refactor per workload with automated validation.' },
        { title: 'Modernize & Optimize', description: 'Containerize, serverless-ify, implement GitOps, and establish FinOps rhythm.' },
        { title: 'Operate at Scale', description: 'SRE practices, capacity planning, disaster recovery testing, and continuous optimization.' },
      ],
      'Vertical Solutions': [
        { title: 'Domain Immersion', description: 'Regulatory landscape, competitive benchmarking, and stakeholder ecosystem mapping.' },
        { title: 'Reference Architecture', description: 'Industry blueprints, compliance mappings, and integration patterns.' },
        { title: 'Pilot & Validate', description: 'Narrow-scope production pilot with success metrics and regulatory review.' },
        { title: 'Scale & Integrate', description: 'Enterprise rollout, legacy decommission, and ecosystem partner onboarding.' },
        { title: 'Innovate & Lead', description: 'AI/ML use cases, platform extensibility, and industry standards participation.' },
      ],
    };
    return processMap[svc.title] || [
      { title: 'Discover', description: 'Understand your context, constraints, and desired outcomes.' },
      { title: 'Design', description: 'Architect a solution that balances speed, quality, and maintainability.' },
      { title: 'Deliver', description: 'Build in small increments with continuous feedback and validation.' },
      { title: 'Operate', description: 'Run reliably with observability, automation, and clear ownership.' },
      { title: 'Evolve', description: 'Measure, learn, and continuously improve the solution.' },
    ];
  }
}