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
    title: 'Microservices at scale: when to decompose and when to hold back',
    slug: 'microservices-at-scale-decompose-hold-back',
    excerpt: 'The decision to split a monolith is not just technical. It changes team dynamics, deployment complexity, and operational overhead.',
    body: 'The decision to split a monolith is not just technical. It changes team dynamics, deployment complexity, and operational overhead. This guide covers when to decompose, when to hold back, and how to make the transition successfully.',
    image: '/images/posts/legacy-rewrite-or-retire.svg?v=4',
    is_published: true,
    published_at: '2026-10-14',
    views: 3200,
    category: { id: 1, name: 'Engineering', slug: 'engineering', description: null },
    author: { id: 1, name: 'Michael TechLead', avatar: '/images/team/john-doe.svg' },
  },
  {
    id: 2,
    title: 'Data privacy in Africa: navigating GDPR, Kenya DPA, and sector regulations',
    slug: 'data-privacy-africa-gdpr-kenya-dpa',
    excerpt: 'African businesses handling EU or Kenyan citizen data must comply with overlapping regulations. Here\'s how to build compliance into your product from day one.',
    body: 'African businesses handling EU or Kenyan citizen data must comply with overlapping regulations. Here\'s how to build compliance into your product from day one.',
    image: '/images/posts/infrastructure-as-code.svg?v=4',
    is_published: true,
    published_at: '2026-10-12',
    views: 2800,
    category: { id: 2, name: 'Security', slug: 'security', description: null },
    author: { id: 2, name: 'Abdullahi Suleiman', avatar: '/images/team/sipho-ndlovu.svg' },
  },
  {
    id: 3,
    title: 'Building inclusive products: designing for East Africa\'s linguistic diversity',
    slug: 'building-inclusive-products-east-africa-linguistic-diversity',
    excerpt: 'With over 100 languages spoken in East Africa, designing inclusive digital products requires more than translation.',
    body: 'With over 100 languages spoken in East Africa, designing inclusive digital products requires more than translation.',
    image: '/images/real/team-meeting.jpg?v=4',
    is_published: true,
    published_at: '2026-10-10',
    views: 1900,
    category: { id: 1, name: 'Engineering', slug: 'engineering', description: null },
    author: { id: 3, name: 'Diana Mutua', avatar: '/images/team/chloe-adams.svg' },
  },
  {
    id: 4,
    title: 'Digital Transformation in Education: Next-Generation Campus Management',
    slug: 'digital-transformation-education-next-gen-campus',
    excerpt: 'How educational institutions across Africa are embracing technology for better student management and improved learning outcomes.',
    body: 'How educational institutions across Africa are embracing technology for better student management and improved learning outcomes.',
    image: '/images/posts/education-campus-management.svg?v=4',
    is_published: true,
    published_at: '2026-05-17',
    views: 5400,
    category: { id: 3, name: 'Education', slug: 'education', description: null },
    author: { id: 4, name: 'Prof. Linda Akinyi', avatar: '/images/team/mary-smith.svg' },
  },
  {
    id: 5,
    title: 'Zero-trust architecture: a practical adoption guide for African businesses',
    slug: 'zero-trust-architecture-african-businesses',
    excerpt: 'Zero-trust is no longer a buzzword. Here\'s how to adopt it without shutting down your business.',
    body: 'Zero-trust is no longer a buzzword. Here\'s how to adopt it without shutting down your business.',
    image: '/images/solutions/pos-software.jpg?v=4',
    is_published: true,
    published_at: '2026-10-11',
    views: 2100,
    category: { id: 2, name: 'Security', slug: 'security', description: null },
    author: { id: 5, name: 'Abdullahi Suleiman', avatar: '/images/team/sipho-ndlovu.svg' },
  },
  {
    id: 6,
    title: 'Why we write tests before we write features',
    slug: 'why-we-write-tests-before-features',
    excerpt: 'The real return on testing is not fewer bugs. It is the confidence to change code you did not write.',
    body: 'The real return on testing is not fewer bugs. It is the confidence to change code you did not write.',
    image: '/images/posts/tests-before-features.svg?v=4',
    is_published: true,
    published_at: '2026-10-02',
    views: 1750,
    category: { id: 1, name: 'Engineering', slug: 'engineering', description: null },
    author: { id: 6, name: 'Kevin Omondi', avatar: '/images/team/riaan-van-wyk.svg' },
  },
  {
    id: 7,
    title: 'Three cloud cost mistakes we see in every audit',
    slug: 'three-cloud-cost-mistakes-audit',
    excerpt: 'Orphaned storage, always-on non-production, and missing shutdown policies. Usually 20 to 40 percent of the bill.',
    body: 'Orphaned storage, always-on non-production, and missing shutdown policies. Usually 20 to 40 percent of the bill.',
    image: '/images/posts/cloud-cost-mistakes.svg?v=4',
    is_published: true,
    published_at: '2026-09-14',
    views: 3800,
    category: { id: 4, name: 'Cloud', slug: 'cloud', description: null },
    author: { id: 7, name: 'Kevin Omondi', avatar: '/images/team/riaan-van-wyk.svg' },
  },
  {
    id: 8,
    title: 'Buy versus build is a staffing decision',
    slug: 'buy-versus-build-staffing-decision',
    excerpt: 'The licence fee is the small part of the total. Ongoing maintenance is what decides it.',
    body: 'The licence fee is the small part of the total. Ongoing maintenance is what decides it.',
    image: '/images/posts/buy-versus-build.svg?v=4',
    is_published: true,
    published_at: '2026-08-27',
    views: 1420,
    category: { id: 5, name: 'Business', slug: 'business', description: null },
    author: { id: 8, name: 'Fanuel Otuya', avatar: '/images/team/fanuel-otuya.svg' },
  },
  {
    id: 9,
    title: 'Your backups are not tested until you have restored one',
    slug: 'backups-not-tested-until-restored',
    excerpt: 'A green backup dashboard proves the job ran. It says nothing about whether the data is recoverable.',
    body: 'A green backup dashboard proves the job ran. It says nothing about whether the data is recoverable.',
    image: '/images/posts/backup-restore-drill.svg?v=4',
    is_published: true,
    published_at: '2026-08-08',
    views: 2210,
    category: { id: 2, name: 'Security', slug: 'security', description: null },
    author: { id: 9, name: 'Abdullahi Suleiman', avatar: '/images/team/sipho-ndlovu.svg' },
  },
];

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Engineering', slug: 'engineering', description: null },
  { id: 2, name: 'Security', slug: 'security', description: null },
  { id: 3, name: 'Education', slug: 'education', description: null },
  { id: 4, name: 'Cloud', slug: 'cloud', description: null },
  { id: 5, name: 'Business', slug: 'business', description: null },
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
      backgroundImage="/images/real/hero-office.jpg?v=4"
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