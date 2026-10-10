import { Component, inject, input, computed, signal } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../shared/reveal/reveal.directive';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { Paginated, Post } from '../../core/models';
import { PostCardComponent } from '../../shared/post-card/post-card.component';

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: 'Transforming Healthcare with Otuya Integrated Hospital ERP',
    slug: 'transforming-healthcare-otuya-integrated-hospital-erp',
    excerpt: 'Discover how our integrated hospital management system is revolutionizing patient care and operational efficiency across healthcare facilities.',
    body: `Discover how our integrated hospital management system is revolutionizing patient care and operational efficiency across healthcare facilities.

Otuya e-Health Hospital ERP provides centralized patient management across multiple hospitals, electronic health records with lab/imaging integration, financial management and automated billing, pharmacy and inventory management, appointment and queue management, and telemedicine modules.`,
    image: '/images/solutions/erp-supply-chain.png',
    is_published: true,
    published_at: '2024-01-15',
    views: 12450,
    category: { id: 1, name: 'Healthcare Technology', slug: 'healthcare-technology', description: null },
    author: { id: 1, name: 'Dr. Sarah Kimani', avatar: '/images/team/mary-smith.svg' },
  },
  {
    id: 2,
    title: 'The Future of FinTech: Otuya Financials Case Study',
    slug: 'future-fintech-otuya-financials-case-study',
    excerpt: 'Exploring how our Savings and Credit Solution is empowering SACCOs and microfinance institutions across the region with cutting-edge technology.',
    body: `Exploring how our Savings and Credit Solution is empowering SACCOs and microfinance institutions across the region with cutting-edge technology.

Otuya Financials provides client/member portfolio management, savings & loans modules with risk analysis, microfinance management, automated reconciliation & reporting, regulatory compliance engine, and multi-currency & multi-branch support.`,
    image: '/images/solutions/erp-business-central.svg',
    is_published: true,
    published_at: '2024-01-12',
    views: 8930,
    category: { id: 2, name: 'Financial Technology', slug: 'financial-technology', description: null },
    author: { id: 2, name: 'James Mwangi', avatar: '/images/team/john-doe.svg' },
  },
  {
    id: 3,
    title: 'Otuya Insure: Revolutionizing Insurance Distribution',
    slug: 'otuya-insure-revolutionizing-insurance-distribution',
    excerpt: 'How our end-to-end insurance SaaS platform is streamlining insurance processes and dramatically improving customer experience across the continent.',
    body: `How our end-to-end insurance SaaS platform is streamlining insurance processes and dramatically improving customer experience across the continent.

Otuya Insure provides insurance master data management, multi-product definition engine, policy administration & lifecycle, claims processing & workflow, distribution & broker portal, and regulatory reporting & compliance.`,
    image: '/images/solutions/apps-photo.jpg',
    is_published: true,
    published_at: '2024-01-10',
    views: 15670,
    category: { id: 3, name: 'Insurance Technology', slug: 'insurance-technology', description: null },
    author: { id: 3, name: 'Grace Njoroge', avatar: '/images/team/mary-smith.svg' },
  },
  {
    id: 4,
    title: 'Smart Manufacturing: Otuya ERP Solutions Driving Industrial Growth',
    slug: 'smart-manufacturing-otuya-erp-solutions',
    excerpt: 'Leveraging smart manufacturing ERP to optimize manufacturing processes and supply chain management for African industries.',
    body: `Leveraging smart manufacturing ERP to optimize manufacturing processes and supply chain management for African industries.

Otuya Manufacturing ERP provides real-time production monitoring dashboard, predictive maintenance scheduling, quality management & traceability, supply chain & procurement automation, MES/ERP convergence, and OT/IT security integration.`,
    image: '/images/solutions/erp-supply-chain.png',
    is_published: true,
    published_at: '2024-01-08',
    views: 11200,
    category: { id: 4, name: 'Manufacturing', slug: 'manufacturing', description: null },
    author: { id: 4, name: 'David Ochieng', avatar: '/images/team/john-doe.svg' },
  },
  {
    id: 5,
    title: 'Digital Transformation in Education: Next-Generation Campus Management',
    slug: 'digital-transformation-education-next-gen-campus-management',
    excerpt: 'How educational institutions across Africa are embracing technology for better student management and improved learning outcomes.',
    body: `How educational institutions across Africa are embracing technology for better student management and improved learning outcomes.

Otuya Academics provides course creation & management, student progress tracking, assessment & certification engine, virtual classroom & live sessions, content library & resource management, and analytics & learning insights.`,
    image: '/images/solutions/data-pipeline.svg',
    is_published: true,
    published_at: '2024-01-05',
    views: 9840,
    category: { id: 5, name: 'Education', slug: 'education', description: null },
    author: { id: 5, name: 'Prof. Linda Akinyi', avatar: '/images/team/mary-smith.svg' },
  },
  {
    id: 6,
    title: 'Building Scalable Microservices with Spring Boot: Technical Deep Dive',
    slug: 'building-scalable-microservices-spring-boot',
    excerpt: 'A comprehensive technical exploration of our microservices architecture powering Otuya Financials and other enterprise solutions.',
    body: `A comprehensive technical exploration of our microservices architecture powering Otuya Financials and other enterprise solutions.

This guide covers domain event extraction, contract testing strategies, feature flag governance, and the organizational changes required to sustain the pace.`,
    image: '/images/real/coding-session.svg',
    is_published: true,
    published_at: '2024-01-03',
    views: 13420,
    category: { id: 6, name: 'Technical', slug: 'technical', description: null },
    author: { id: 6, name: 'Michael TechLead', avatar: '/images/team/john-doe.svg' },
  },
  {
    id: 7,
    title: 'Cloud Migration Strategies for Enterprises: A Practical Guide',
    slug: 'cloud-migration-strategies-enterprises',
    excerpt: 'Best practices and lessons learned from helping African businesses successfully migrate to cloud infrastructure.',
    body: `Best practices and lessons learned from helping African businesses successfully migrate to cloud infrastructure.

Otuya Cloud provides migration services, platform engineering, and managed services for enterprises.`,
    image: '/images/solutions/pos-software.png',
    is_published: true,
    published_at: '2023-12-28',
    views: 11200,
    category: { id: 7, name: 'Cloud Computing', slug: 'cloud-computing', description: null },
    author: { id: 7, name: 'Brian CloudExpert', avatar: '/images/team/john-doe.svg' },
  },
  {
    id: 8,
    title: 'AI and Machine Learning in African Business: Real-World Applications',
    slug: 'ai-machine-learning-african-business',
    excerpt: 'Exploring practical AI implementations that are driving business value across various industries in Africa.',
    body: `Exploring practical AI implementations that are driving business value across various industries in Africa.`,
    image: '/images/solutions/website-photo.jpg',
    is_published: true,
    published_at: '2023-12-25',
    views: 9840,
    category: { id: 8, name: 'Artificial Intelligence', slug: 'artificial-intelligence', description: null },
    author: { id: 8, name: 'Dr. Aisha Mohammed', avatar: '/images/team/mary-smith.svg' },
  },
  {
    id: 9,
    title: 'Data Security and Compliance in African Digital Solutions',
    slug: 'data-security-compliance-african-digital-solutions',
    excerpt: 'Ensuring robust data protection and regulatory compliance in our technology solutions for African markets.',
    body: `Ensuring robust data protection and regulatory compliance in our technology solutions for African markets.`,
    image: '/images/solutions/pos-software.png',
    is_published: true,
    published_at: '2023-12-20',
    views: 8930,
    category: { id: 9, name: 'Security', slug: 'security', description: null },
    author: { id: 9, name: 'Kevin SecurityExpert', avatar: '/images/team/john-doe.svg' },
  },
  {
    id: 10,
    title: 'The Future of Work: Digital Tools Transforming African Workplaces',
    slug: 'future-work-digital-tools-transforming-african-workplaces',
    excerpt: 'How digital collaboration tools and remote work technologies are reshaping workplace dynamics across Africa.',
    body: `How digital collaboration tools and remote work technologies are reshaping workplace dynamics across Africa.`,
    image: '/images/solutions/website-photo.jpg',
    is_published: true,
    published_at: '2023-12-15',
    views: 7650,
    category: { id: 10, name: 'Workplace Technology', slug: 'workplace-technology', description: null },
    author: { id: 10, name: 'Rachel Mbeki', avatar: '/images/team/mary-smith.svg' },
  },
];

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, DatePipe, PostCardComponent, RevealDirective],
  template: `
    <ng-container *ngIf="resolvedPost() as p; else loading">
      <article class="section article">
        <div class="article__hero" [style.background-image]="'url(' + (p.image || '/images/placeholders/blog-placeholder.svg') + ')'"></div>
        <div class="container article__inner">
          <nav class="crumbs">
            <a routerLink="/insights">Insights</a>
            <ng-container *ngIf="p.category">
              <span>/</span>
              <a [routerLink]="['/insights']" [queryParams]="{ category: p.category.slug }">{{ p.category.name }}</a>
            </ng-container>
          </nav>

          <span class="badge" *ngIf="p.category">{{ p.category.name }}</span>
          <h1 class="article__title">{{ p.title }}</h1>

          <div class="article__meta">
            <span *ngIf="p.author?.name">{{ p.author?.name }}</span>
            <span *ngIf="p.published_at">{{ p.published_at | date: 'd MMMM y' }}</span>
            <span>{{ p.views }} views</span>
          </div>

          <p class="article__excerpt" *ngIf="p.excerpt">{{ p.excerpt }}</p>

          <hr class="divider" />

          <div class="prose article__body">
            <p *ngFor="let paragraph of paragraphs(p.body)">{{ paragraph }}</p>
          </div>

          <div class="article__footer">
            <a routerLink="/insights" class="btn btn--ghost btn--sm">Back to insights</a>
            <a routerLink="/contact" class="btn btn--primary btn--sm">Discuss a similar challenge</a>
          </div>
        </div>
      </article>

      <section class="section section--muted" *ngIf="related().length">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow" appReveal="up">Keep reading</span>
            <h2 appReveal="mask" [appRevealDelay]="70">More insights</h2>
          </div>
          <div class="grid grid--3">
            <app-post-card *ngFor="let item of related(); let i = index" [post]="item" appReveal="up" [appRevealDelay]="i * 70" />
          </div>
        </div>
      </section>
    </ng-container>

    <ng-template #loading>
      <div class="spinner" *ngIf="!notFound()"></div>
      <section class="notfound" *ngIf="notFound()">
        <div class="container notfound__inner">
          <h1>Article not found</h1>
          <p>We could not find an article at this address. It may have been unpublished, or the link that brought you here may be out of date.</p>
          <div class="notfound__actions">
            <a routerLink="/insights" class="btn btn--ghost">Back to insights</a>
            <a routerLink="/contact" class="btn btn--primary">Contact us</a>
          </div>
        </div>
      </section>
    </ng-template>
  `,
  styles: [
    `
      .article {
        margin-top: 0;
        padding-top: 0;
      }
      .article__hero {
        position: relative;
        height: 420px;
        background-size: cover;
        background-position: center;
        margin: -48px -24px 0;
        border-radius: 0 0 var(--radius-xl) var(--radius-xl);
      }
      .article__hero::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.3) 50%, transparent 100%);
        border-radius: 0 0 var(--radius-xl) var(--radius-xl);
      }
      .article__inner { max-width: 780px; position: relative; z-index: 1; padding-top: 32px; }
      .crumbs { display: flex; gap: 9px; font-size: 0.85rem; margin-bottom: 24px; color: var(--slate-500); }
      .crumbs a { color: var(--slate-600); transition: color var(--transition-fast); }
      .crumbs a:hover { color: var(--pink-500); }
      .article__title { margin: 14px 0 16px; font-size: clamp(1.75rem, 4vw, 2.5rem); }
      .article__meta {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        font-size: 0.86rem;
        color: var(--slate-500);
        margin-bottom: 26px;
      }
      .article__excerpt {
        font-size: 1.14rem;
        color: var(--slate-700);
        font-weight: 500;
        border-left: 3px solid var(--blue-600);
        padding-left: 20px;
        margin-bottom: 24px;
      }
      .article__body p { font-size: 1.03rem; line-height: 1.8; color: var(--slate-800); margin-bottom: 1.2rem; }
      .article__footer {
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
        margin-top: 44px;
        padding-top: 28px;
        border-top: 1px solid var(--slate-200);
      }
      .divider { border: none; border-top: 1px solid var(--slate-200); margin: 32px 0; }

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

      @media (max-width: 768px) {
        .article__hero { height: 280px; margin: -24px -16px 0; }
        .article__inner { padding-top: 24px; }
        .notfound { padding: 60px 0 70px; }
        .notfound__inner { padding: 36px 24px; }
      }
    `,
  ],
})
export class PostDetailComponent {
  private readonly api = inject(ApiService);

  readonly slug = input.required<string>();

  readonly loaded = signal(false);

  readonly post = toSignal(
    toObservable(this.slug).pipe(
      switchMap((slug) => this.api.post(slug).pipe(catchError(() => of(null)))),
      tap(() => this.loaded.set(true)),
    ),
    { initialValue: null as Post | null },
  );

  private readonly latestFromApi = toSignal(this.api.posts({ per_page: 4 }).pipe(catchError(() => of(null))), {
    initialValue: null as Paginated<Post> | null,
  });

  readonly latest = computed(() => {
    const apiData = this.latestFromApi()?.data ?? [];
    return apiData.length > 0 ? apiData : MOCK_POSTS;
  });

  readonly resolvedPost = computed(() => {
    const fromApi = this.post();
    if (fromApi) return fromApi;
    return MOCK_POSTS.find((p) => p.slug === this.slug()) ?? null;
  });

  readonly notFound = computed(() => this.loaded() && !this.resolvedPost());

  paragraphs(body: string): string[] {
    return (body ?? '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  }

  related(): Post[] {
    const current = this.resolvedPost();
    return this.latest().filter((p) => p.id !== current?.id).slice(0, 3);
  }
}