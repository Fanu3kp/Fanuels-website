import { Component, inject, signal, computed } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ApiService } from '../../core/api.service';
import { Category, Paginated, Post } from '../../core/models';
import { PageHeroComponent } from '../../shared/page-hero/page-hero.component';
import { PostCardComponent } from '../../shared/post-card/post-card.component';
import { RevealDirective } from '../../shared/reveal/reveal.directive';

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
    image: '/images/real/data-pipeline.svg',
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

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Healthcare Technology', slug: 'healthcare-technology', description: null },
  { id: 2, name: 'Financial Technology', slug: 'financial-technology', description: null },
  { id: 3, name: 'Insurance Technology', slug: 'insurance-technology', description: null },
  { id: 4, name: 'Manufacturing', slug: 'manufacturing', description: null },
  { id: 5, name: 'Education', slug: 'education', description: null },
  { id: 6, name: 'Technical', slug: 'technical', description: null },
  { id: 7, name: 'Cloud Computing', slug: 'cloud-computing', description: null },
  { id: 8, name: 'Artificial Intelligence', slug: 'artificial-intelligence', description: null },
  { id: 9, name: 'Security', slug: 'security', description: null },
  { id: 10, name: 'Workplace Technology', slug: 'workplace-technology', description: null },
];

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, FormsModule, PageHeroComponent, PostCardComponent, RevealDirective],
  template: `
    <app-page-hero
      eyebrow="Insights"
      title="Engineering notes on POS, apps, web platforms, ERP"
      subtitle="Lessons from building and delivering technology solutions across industries."
      backgroundImage="/images/backgrounds/section-bg.svg"
    />

    <section class="section">
      <div class="container">
        <div class="filters">
          <button class="chip" [class.chip--active]="category() === ''" (click)="setCategory('')">
            All
          </button>
          <button
            class="chip"
            *ngFor="let item of categories()"
            [class.chip--active]="category() === item.slug"
            (click)="setCategory(item.slug)"
          >
            {{ item.name }}
          </button>

          <div class="search">
            <input
              type="search"
              placeholder="Search insights"
              [ngModel]="search()"
              (ngModelChange)="onSearch($event)"
              aria-label="Search insights"
            />
          </div>
        </div>

        <div class="grid grid--3" *ngIf="posts().length; else spinner">
          <app-post-card *ngFor="let post of posts(); let i = index" [post]="post" appReveal="up" [appRevealDelay]="i * 70" />
        </div>

        <ng-template #spinner>
          <div class="spinner"></div>
        </ng-template>

        <div class="empty-state" *ngIf="!loading() && !posts().length">
          <h3>Nothing published here yet</h3>
          <p>Try a different category or clear your search.</p>
        </div>

        <div class="pager" *ngIf="lastPage() > 1" appReveal="up">
          <button class="btn btn--ghost btn--sm" [disabled]="page() <= 1 || loading()" (click)="go(page() - 1)">
            Previous
          </button>
          <span>Page {{ page() }} of {{ lastPage() }}</span>
          <button class="btn btn--ghost btn--sm" [disabled]="page() >= lastPage() || loading()" (click)="go(page() + 1)">
            Next
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .filters {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 40px;
        padding-bottom: 26px;
        border-bottom: 1px solid var(--slate-200);
      }
      .chip {
        padding: 8px 18px;
        border-radius: 999px;
        border: 1px solid var(--slate-300);
        background: var(--white);
        font-family: inherit;
        font-size: 0.88rem;
        font-weight: 500;
        color: var(--slate-700);
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .chip:hover { border-color: var(--slate-500); }
      .chip--active { background: var(--navy-800); border-color: var(--navy-800); color: var(--white); }
      .search { margin-left: auto; min-width: 240px; }
      .search input { max-width: 280px; }
      .pager {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        margin-top: 46px;
        font-size: 0.9rem;
        color: var(--slate-500);
      }
      @media (max-width: 900px) {
        .grid--3 { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 620px) {
        .grid--3 { grid-template-columns: 1fr; }
        .filters { justify-content: center; }
        .search { min-width: 100%; margin-left: 0; margin-top: 12px; }
        .search input { max-width: 100%; }
        .pager { flex-direction: column; gap: 12px; }
      }
     `,
   ]
 })
export class BlogComponent {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  readonly category = signal('');
  readonly search = signal('');
  readonly page = signal(1);
  readonly loading = signal(true);
  readonly response = signal<Paginated<Post> | null>(null);

  readonly categories = computed(() => {
    const apiCats = this.categoriesFromApi();
    return apiCats.length > 0 ? apiCats : MOCK_CATEGORIES;
  });

  private readonly categoriesFromApi = signal<Category[]>([]);

  readonly posts = computed(() => {
    const apiData = this.response()?.data ?? [];
    return apiData.length > 0 ? apiData : MOCK_POSTS;
  });

  readonly lastPage = computed(() => {
    const apiData = this.response()?.data ?? [];
    return apiData.length > 0 ? (this.response()?.last_page ?? 1) : 1;
  });

  constructor() {
    this.api.categories().subscribe({
      next: (items) => this.categoriesFromApi.set(items),
      error: () => this.categoriesFromApi.set([]),
    });

    this.route.queryParamMap.subscribe((params) => {
      const slug = params.get('category') ?? '';
      const term = params.get('q') ?? '';

      if (term !== this.search()) {
        this.search.set(term);
      }

      if (slug !== this.category()) {
        this.category.set(slug);
        this.page.set(1);
        this.load(1);
        return;
      }

      this.page.set(1);
      this.load(1);
    });
  }

  setCategory(slug: string): void {
    this.category.set(slug);
    this.page.set(1);
    this.syncUrl();
    this.load(1);
  }

  private syncUrl(): void {
    const queryParams: Record<string, string> = {};
    if (this.category()) queryParams['category'] = this.category();
    if (this.search().trim()) queryParams['q'] = this.search().trim();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true,
    });
  }

  onSearch(term: string): void {
    this.search.set(term);

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      this.page.set(1);
      this.syncUrl();
      this.load(1);
    }, 350);
  }

  go(page: number): void {
    if (page < 1 || page > this.lastPage()) {
      return;
    }

    this.page.set(page);
    this.load(page);
  }

  private load(page: number): void {
    this.loading.set(true);

    const params: Record<string, string | number> = { per_page: 9, page };

    if (this.category()) {
      params['category'] = this.category();
    }

    if (this.search().trim()) {
      params['search'] = this.search().trim();
    }

    this.api
      .posts(params)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.response.set(res);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: () => {
          this.response.set(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
      });
  }
}