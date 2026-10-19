import { Component, inject, signal, computed, effect } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { PageHeroComponent } from '../../shared/page-hero/page-hero.component';
import { RevealDirective } from '../../shared/reveal/reveal.directive';
import { Service, Project, Post, Paginated, SearchResult, SearchResultItem } from '../../core/models';
import { iconGlyph } from '../../core/icon-glyphs';

const MOCK_SERVICES: Service[] = [
  { id: 1, title: 'Digital Transformation', slug: 'digital-transformation', summary: 'End-to-end transformation programs that align people, process, and technology around measurable business outcomes.', body: '', icon: 'strategy', image: '/images/real/cloud-architecture.svg', highlights: null, sort_order: 1, is_featured: true, is_active: true },
  { id: 2, title: 'Custom Software Development', slug: 'custom-software-development', summary: 'Product-minded engineering teams delivering scalable, maintainable software — from greenfield products to platform modernization.', body: '', icon: 'code', image: '/images/real/coding-session.svg', highlights: null, sort_order: 2, is_featured: true, is_active: true },
  { id: 3, title: 'ERP Implementation', slug: 'erp-implementation', summary: 'Proven methodology for ERP deployments that minimize risk, accelerate time-to-value, and ensure user adoption.', body: '', icon: 'erp', image: '/images/real/cloud-server.jpg', highlights: null, sort_order: 3, is_featured: true, is_active: true },
  { id: 4, title: 'Cloud Migration', slug: 'cloud-migration', summary: 'Structured migration programs that reduce cost, improve resilience, and unlock cloud-native capabilities.', body: '', icon: 'cloud', image: '/images/real/server-room.svg', highlights: null, sort_order: 4, is_featured: false, is_active: true },
];

const MOCK_POSTS: Post[] = [
  { id: 1, title: 'Why Your Cloud Migration Is Stuck at 60%', slug: 'why-cloud-migration-stuck-at-60', excerpt: 'Most enterprises migrate the easy workloads first. The hard part — legacy apps with data gravity — requires a different playbook.', body: '', image: '/images/real/cloud-architecture.svg', is_published: true, published_at: '2024-03-12', views: 12450, category: { id: 1, name: 'Cloud', slug: 'cloud', description: null }, author: { id: 1, name: 'Sarah Chen', avatar: '/images/team/mary-smith.svg' } },
  { id: 2, title: 'The Hidden Cost of Technical Debt in ERP Implementations', slug: 'hidden-cost-technical-debt-erp', excerpt: 'Customizations that seemed pragmatic during go-live become anchor weights during upgrade cycles.', body: '', image: '/images/real/server-room.svg', is_published: true, published_at: '2024-02-28', views: 8930, category: { id: 2, name: 'Enterprise', slug: 'enterprise', description: null }, author: { id: 2, name: 'Marcus Webb', avatar: '/images/team/john-doe.svg' } },
  { id: 3, title: 'Zero Trust in Practice: From Policy to Pipeline', slug: 'zero-trust-practice-policy-pipeline', excerpt: 'Zero trust isn\'t a product. It\'s an architecture pattern that touches identity, network, device, and application layers.', body: '', image: '/images/real/data-pipeline.svg', is_published: true, published_at: '2024-02-15', views: 15670, category: { id: 3, name: 'Security', slug: 'security', description: null }, author: { id: 3, name: 'Priya Sharma', avatar: '/images/team/mary-smith.svg' } },
];

interface DisplayResult {
  type: 'service' | 'project' | 'post' | 'page' | 'team';
  title: string;
  summary: string | null;
  route: string;
  icon: string;
  meta: string;
  image: string | null;
}

const MOCK_TEAM = [
  { id: 1, name: 'Fanuel Otuya', role: 'Group Founder & CEO', bio: 'Founder & CEO of Otuya Global. Software engineering, cloud architecture and technology delivery leadership.', image: null },
  { id: 2, name: 'Sarah Chen', role: 'Chief Technology Officer', bio: 'CTO leading platform architecture, security and engineering quality across the group.', image: null },
  { id: 3, name: 'Marcus Webb', role: 'Director of Engineering', bio: 'Director of Engineering overseeing delivery, infrastructure and developer experience.', image: null },
  { id: 4, name: 'Priya Sharma', role: 'Head of Product', bio: 'Head of Product shaping Otuya POS, Financials, Insure, ERP and CRM roadmaps.', image: null },
];

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, FormsModule, DatePipe, PageHeroComponent, RevealDirective],
  template: `
    <app-page-hero
      eyebrow="Search"
      title="Search results for &quot;{{ query() }}&quot;"
      [subtitle]="totalResults() > 0
        ? totalResults() + ' result' + (totalResults() === 1 ? '' : 's') + ' found across the site.'
        : 'No results found. Try a different search term.'
      "
    />

    <section class="section">
      <div class="container">
        <div class="search-box" appReveal="up">
          <form (submit)="onSearch($event)" class="search-form">
            <label for="site-search" class="sr-only">Search site</label>
            <input
              id="site-search"
              type="search"
              placeholder="Search anything on our site..."
              [ngModel]="query()"
              (ngModelChange)="onQueryChange($event)"
              aria-label="Search"
              autocomplete="off"
              autofocus
            />
            <button type="submit" class="btn btn--primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </form>
        </div>

        <div *ngIf="loading(); else resultsBlock">
          <div class="spinner"></div>
        </div>

        <ng-template #resultsBlock>
          <div *ngIf="totalResults() === 0; else hasResults">
            <div class="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-state__icon">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                <line x1="11" y1="8" x2="11.01" y2="12"/>
                <line x1="11" y1="16" x2="11.01" y2="16"/>
              </svg>
              <h3>No results for &quot;{{ query() }}&quot;</h3>
              <p>Try a different search term or browse our <a routerLink="/services">services</a>, <a routerLink="/projects">projects</a>, or <a routerLink="/insights">insights</a>.</p>
            </div>
          </div>

          <ng-template #hasResults>
            <div class="results-section" *ngIf="serviceResults().length" appReveal="up">
              <h3 class="results-section__label">Services ({{ serviceResults().length }})</h3>
              <div class="results-grid">
                <a
                  *ngFor="let item of serviceResults(); let i = index"
                  [routerLink]="item.route"
                  class="search-result-card"
                  appReveal="up"
                  [appRevealDelay]="i * 50"
                >
                  <span class="result-icon">{{ item.icon }}</span>
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.summary }}</p>
                  <span class="result-link">View service</span>
                </a>
              </div>
            </div>

            <div class="results-section" *ngIf="projectResults().length" appReveal="up" [appRevealDelay]="serviceResults().length ? serviceResults().length * 50 : 0">
              <h3 class="results-section__label">Projects ({{ projectResults().length }})</h3>
              <div class="results-grid">
                <a
                  *ngFor="let item of projectResults(); let i = index"
                  [routerLink]="item.route"
                  class="search-result-card"
                  appReveal="up"
                  [appRevealDelay]="i * 50"
                >
                  <span class="result-icon">📁</span>
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.summary }}</p>
                  <span class="result-meta" *ngIf="item.meta">{{ item.meta }}</span>
                  <span class="result-link">View project</span>
                </a>
              </div>
            </div>

            <div class="results-section" *ngIf="teamResults().length" appReveal="up" [appRevealDelay]="(serviceResults().length + projectResults().length) * 50">
              <h3 class="results-section__label">Team ({{ teamResults().length }})</h3>
              <div class="results-grid">
                <a
                  *ngFor="let item of teamResults(); let i = index"
                  [routerLink]="item.route"
                  class="search-result-card"
                  appReveal="up"
                  [appRevealDelay]="i * 50"
                >
                  <span class="result-icon">👤</span>
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.summary }}</p>
                  <span class="result-link">View profile</span>
                </a>
              </div>
            </div>

            <div class="results-section" *ngIf="postResults().length" appReveal="up" [appRevealDelay]="(serviceResults().length + projectResults().length + teamResults().length) * 50">
              <h3 class="results-section__label">Insights ({{ postResults().length }})</h3>
              <div class="results-grid">
                <a
                  *ngFor="let item of postResults(); let i = index"
                  [routerLink]="item.route"
                  class="search-result-card"
                  appReveal="up"
                  [appRevealDelay]="i * 50"
                >
                  <span class="result-icon">{{ item.icon }}</span>
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.summary }}</p>
                  <span class="result-meta">{{ item.meta }}</span>
                  <span class="result-link">Read article</span>
                </a>
              </div>
            </div>

            <div class="results-section" *ngIf="pageResults().length" appReveal="up" [appRevealDelay]="(serviceResults().length + projectResults().length + teamResults().length + postResults().length) * 50">
              <h3 class="results-section__label">Pages ({{ pageResults().length }})</h3>
              <div class="results-grid">
                <a
                  *ngFor="let item of pageResults(); let i = index"
                  [routerLink]="item.route"
                  class="search-result-card"
                  appReveal="up"
                  [appRevealDelay]="i * 50"
                >
                  <span class="result-icon">📄</span>
                  <h4>{{ item.title }}</h4>
                  <span class="result-link">Go to page</span>
                </a>
              </div>
            </div>
          </ng-template>
        </ng-template>
      </div>
    </section>
  `,
  styles: [`
    .search-box {
      max-width: 640px;
      margin: 0 auto 40px;
    }
    .search-form {
      display: flex;
      gap: 12px;
    }
    .search-form input {
      flex: 1;
      padding: 12px 20px;
      font-size: 1rem;
      border: 1px solid var(--slate-300);
      border-radius: var(--radius-lg);
    }
    .search-form button {
      padding: 12px 24px;
    }
    .results-section {
      margin-bottom: 48px;
    }
    .results-section__label {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--slate-500);
      margin-bottom: 16px;
      border-bottom: 1px solid var(--slate-200);
      padding-bottom: 8px;
    }
    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .search-result-card {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 24px;
      background: var(--white);
      border: 1px solid var(--slate-200);
      border-radius: var(--radius-lg);
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
    }
    .search-result-card:hover {
      box-shadow: var(--shadow-lg);
      border-color: var(--slate-300);
      transform: translateY(-2px);
    }
    .result-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      font-size: 1.2rem;
    }
    .search-result-card h4 {
      margin: 0;
      color: var(--navy-900);
      font-size: 1.1rem;
    }
    .search-result-card p {
      color: var(--slate-600);
      font-size: 0.93rem;
      line-height: 1.5;
      margin: 0;
      flex: 1;
    }
    .result-meta {
      font-size: 0.8rem;
      color: var(--slate-500);
      font-weight: 500;
    }
    .result-link {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--blue-600);
      margin-top: 4px;
    }
    .search-result-card:hover .result-link {
      color: var(--pink-600);
    }
    .empty-state {
      text-align: center;
      padding: 60px 24px;
      color: var(--slate-500);
    }
    .empty-state__icon {
      margin-bottom: 16px;
      opacity: 0.4;
    }
    .empty-state h3 {
      color: var(--navy-900);
      margin-bottom: 8px;
    }
    .empty-state a {
      color: var(--blue-600);
      font-weight: 600;
    }
    .empty-state a:hover {
      color: var(--pink-600);
    }
    @media (max-width: 640px) {
      .search-form {
        flex-direction: column;
      }
      .search-form button {
        width: 100%;
      }
    }
  `],
})
export class SearchComponent {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly query = signal('');
  readonly loading = signal(true);
  readonly apiResults = signal<SearchResultItem[]>([]);

  private readonly searchResponse = toSignal(
    this.api.search('').pipe(catchError(() => of(null))),
    { initialValue: null as SearchResult | null },
  );

  constructor() {
    effect(() => {
      const term = this.query();
      if (term.length >= 1) {
        this.fetchResults(term);
      }
    });

    this.route.queryParamMap.subscribe((params) => {
      const term = params.get('q')?.trim() ?? '';
      if (term !== this.query()) {
        this.query.set(term);
      }
      this.loading.set(false);
    });
  }

  private fetchResults(term: string): void {
    this.loading.set(true);
    this.api.search(term).pipe(
      catchError(() => of(null)),
    ).subscribe({
      next: (res) => {
        if (res?.results) {
          this.apiResults.set(res.results);
        } else {
          this.apiResults.set([]);
        }
        this.loading.set(false);
      },
    });
  }

  readonly displayResults = computed(() => {
    const term = this.query().toLowerCase().trim();
    const apiData = this.apiResults();

    if (apiData.length > 0) {
      return apiData.map((item): DisplayResult => {
        let icon = '📝';
        let meta = '';

        if (item.type === 'service') {
          icon = this.icon(item.id ? MOCK_SERVICES.find(s => s.id === item.id)?.icon || '💼' : '💼');
        } else if (item.type === 'post') {
          icon = item.category?.charAt(0) || '📝';
          if (item.published_at) {
            const d = new Date(item.published_at);
            meta = isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
          }
        } else if (item.type === 'project') {
          icon = '📁';
          if (item.client) {
            meta = item.client;
          }
        } else if (item.type === 'team') {
          icon = '👤';
          if (item.role) {
            meta = item.role;
          }
        } else if (item.type === 'page') {
          icon = '📄';
        }

        return {
          type: item.type,
          title: item.title,
          summary: item.summary ?? null,
          route: item.route,
          icon,
          meta,
          image: item.image ?? null,
        };
      });
    }

    return this.clientSideResults(term);
  });

  private clientSideResults(term: string): DisplayResult[] {
    const results: DisplayResult[] = [];

    MOCK_SERVICES.forEach(s => {
      const text = (s.title + ' ' + s.summary + ' ' + (s.body || '')).toLowerCase();
      if (text.includes(term)) {
        results.push({
          type: 'service',
          title: s.title,
          summary: s.summary,
          route: `/services/${s.slug}`,
          icon: this.icon(s.icon || '💼'),
          meta: '',
          image: s.image,
        });
      }
    });

    MOCK_POSTS.forEach(p => {
      const text = (p.title + ' ' + (p.excerpt || '') + ' ' + p.body).toLowerCase();
      if (text.includes(term)) {
        const d = new Date(p.published_at || '');
        const meta = isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
        results.push({
          type: 'post',
          title: p.title,
          summary: p.excerpt,
          route: `/insights/${p.slug}`,
          icon: p.category?.name?.charAt(0) || '📝',
          meta,
          image: p.image,
        });
      }
    });

    MOCK_TEAM.forEach(m => {
      const text = (m.name + ' ' + m.role + ' ' + m.bio).toLowerCase();
      if (text.includes(term)) {
        results.push({
          type: 'team',
          title: m.name,
          summary: m.role,
          route: '/about',
          icon: '👤',
          meta: m.role,
          image: m.image,
        });
      }
    });

    const pages = [
      { label: 'Home', route: '/', keywords: 'home landing start otuya global' },
      { label: 'About Us', route: '/about', keywords: 'about us company who we are fanuel otuya team leadership' },
      { label: 'Services', route: '/services', keywords: 'services what we do' },
      { label: 'Products', route: '/products', keywords: 'products otuya pos financials insure erp crm' },
      { label: 'Projects', route: '/projects', keywords: 'projects portfolio work' },
      { label: 'Insights', route: '/insights', keywords: 'insights blog articles news' },
      { label: 'Business Units', route: '/business', keywords: 'business units branches poultry cattle' },
      { label: 'Structure', route: '/structure', keywords: 'structure organization units group' },
      { label: 'Careers', route: '/careers', keywords: 'careers jobs vacancies join team' },
      { label: 'FAQ', route: '/faq', keywords: 'faq questions help support' },
      { label: 'Contact', route: '/contact', keywords: 'contact get in touch' },
      { label: 'Lab', route: '/lab', keywords: 'lab visual synthesis' },
    ];

    pages.forEach(page => {
      const text = (page.label + ' ' + page.keywords).toLowerCase();
      if (text.includes(term)) {
        results.push({
          type: 'page' as const,
          title: page.label,
          summary: null,
          route: page.route,
          icon: '📄',
          meta: '',
          image: null,
        });
      }
    });

    return results;
  }

  readonly serviceResults = computed(() => this.displayResults().filter(r => r.type === 'service'));
  readonly projectResults = computed(() => this.displayResults().filter(r => r.type === 'project'));
  readonly teamResults = computed(() => this.displayResults().filter(r => r.type === 'team'));
  readonly postResults = computed(() => this.displayResults().filter(r => r.type === 'post'));
  readonly pageResults = computed(() => this.displayResults().filter(r => r.type === 'page'));
  readonly totalResults = computed(() => this.displayResults().length);

  icon(name: string | null | undefined): string {
    return iconGlyph(name);
  }

  onQueryChange(term: string): void {
    this.query.set(term);
  }

  onSearch(event: Event): void {
    event.preventDefault();
    const term = this.query().trim();
    if (term) {
      this.router.navigate(['/search'], { queryParams: { q: term }, replaceUrl: true });
    }
  }
}
