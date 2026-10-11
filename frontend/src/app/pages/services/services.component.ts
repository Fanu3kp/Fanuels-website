import { Component, inject, computed } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { PageHeroComponent } from '../../shared/page-hero/page-hero.component';
import { LazyImageDirective } from '../../shared/lazy-image/lazy-image.directive';
import { RevealDirective } from '../../shared/reveal/reveal.directive';
import { Service } from '../../core/models';
import { iconGlyph } from '../../core/icon-glyphs';

const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    title: 'Otuya Global POS',
    slug: 'otuya-global-pos',
    summary: 'Comprehensive point-of-sale and retail management system for modern retail operations.',
    body: '',
    icon: 'pos',
    image: '/images/solutions/pos-software.jpg',
    highlights: [
      'Multi-store POS Management',
      'Real-time Inventory Tracking & Management',
      'Customer Loyalty & Rewards Programs',
      'Integrated Payments (Stripe, Adyen, local)',
      'Hardware-agnostic: tablets, terminals, kiosks',
      'Offline-capable with background sync'
    ],
    sort_order: 1,
    is_featured: true,
    is_active: true
  },
  {
    id: 2,
    title: 'Otuya Global Financials',
    slug: 'otuya-global-financials',
    summary: 'A robust savings, credit, and pension management solution for financial institutions.',
    body: '',
    icon: 'finance',
    image: '/images/solutions/erp-business-central.svg',
    highlights: [
      'Client/Member Portfolio Management',
      'Savings & Loans Modules with Risk Analysis',
      'Microfinance Management',
      'Automated Reconciliation & Reporting',
      'Regulatory Compliance Engine',
      'Multi-currency & Multi-branch Support'
    ],
    sort_order: 2,
    is_featured: true,
    is_active: true
  },
  {
    id: 3,
    title: 'Otuya Global e-Health Hospital ERP',
    slug: 'otuya-global-ehealth-hospital-erp',
    summary: 'Comprehensive hospital management system for multi-hospital networks.',
    body: '',
    icon: 'health',
    image: '/images/solutions/erp-supply-chain.jpg',
    highlights: [
      'Centralized Patient Management across multiple hospitals',
      'Electronic Health Records (EHR) with lab/imaging integration',
      'Financial Management & Automated Billing',
      'Pharmacy & Inventory Management',
      'Appointment & Queue Management',
      'Telemedicine & Remote Consultation Module'
    ],
    sort_order: 3,
    is_featured: true,
    is_active: true
  },
  {
    id: 4,
    title: 'Otuya Global Insure',
    slug: 'otuya-global-insure',
    summary: 'End-to-end insurance SaaS technology for insurance distribution and management.',
    body: '',
    icon: 'insure',
    image: '/images/solutions/apps-photo.jpg',
    highlights: [
      'Insurance Master Data Management',
      'Multi-Product Definition Engine',
      'Policy Administration & Lifecycle',
      'Claims Processing & Workflow',
      'Distribution & Broker Portal',
      'Regulatory Reporting & Compliance'
    ],
    sort_order: 4,
    is_featured: true,
    is_active: true
  },
  {
    id: 5,
    title: 'Otuya Global Pension Management System',
    slug: 'otuya-global-pension-management',
    summary: 'Comprehensive pension administration and management solution.',
    body: '',
    icon: 'pension',
    image: '/images/solutions/website-photo.jpg',
    highlights: [
      'Member Registration & Lifecycle Management',
      'Contribution Processing & Reconciliation',
      'Benefit Calculation & Disbursement',
      'Investment Management & Reporting',
      'Regulatory Compliance & Reporting',
      'Member Self-Service Portal'
    ],
    sort_order: 5,
    is_featured: true,
    is_active: true
  },
  {
    id: 6,
    title: 'Otuya Global Manufacturing ERP',
    slug: 'otuya-global-manufacturing-erp',
    summary: 'Smart manufacturing ERP with real-time production monitoring and AI-driven insights.',
    body: '',
    icon: 'manufacturing',
    image: '/images/solutions/erp-supply-chain.jpg',
    highlights: [
      'Real-time Production Monitoring Dashboard',
      'Predictive Maintenance Scheduling',
      'Quality Management & Traceability',
      'Supply Chain & Procurement Automation',
      'MES/ERP Convergence',
      'OT/IT Security Integration'
    ],
    sort_order: 6,
    is_featured: false,
    is_active: true
  },
  {
    id: 7,
    title: 'Otuya Global Customer Relationship Management (CRM)',
    slug: 'otuya-global-crm',
    summary: 'Customized CRM solution for streamlined customer engagement and data-driven insights.',
    body: '',
    icon: 'crm',
    image: '/images/real/coding-session.svg',
    highlights: [
      'Lead & Opportunity Management',
      'Contact & Account Management',
      'Sales Pipeline & Forecasting',
      'Marketing Automation & Campaigns',
      'Customer Service & Ticketing',
      'Analytics & Custom Dashboards'
    ],
    sort_order: 7,
    is_featured: false,
    is_active: true
  },
  {
    id: 8,
    title: 'Otuya Global Case & Contract Management',
    slug: 'otuya-global-case-contract-management',
    summary: 'Web-based system for efficient case and contract management with notification engine.',
    body: '',
    icon: 'legal',
    image: '/images/solutions/website-photo.jpg',
    highlights: [
      'Case Lifecycle Management',
      'Contract Creation & Templates',
      'Document Management & Versioning',
      'Automated Notifications & Reminders',
      'Compliance & Audit Trails',
      'Multi-party Collaboration Workspace'
    ],
    sort_order: 8,
    is_featured: false,
    is_active: true
  },
  {
    id: 9,
    title: 'Otuya Global Academics',
    slug: 'otuya-global-academics',
    summary: 'Microservice-powered e-learning platform for delivering quality education.',
    body: '',
    icon: 'education',
    image: '/images/products/otuya-academics.svg',
    highlights: [
      'Course Creation & Management',
      'Student Progress Tracking',
      'Assessment & Certification Engine',
      'Virtual Classroom & Live Sessions',
      'Content Library & Resource Management',
      'Analytics & Learning Insights'
    ],
    sort_order: 9,
    is_featured: false,
    is_active: true
  }
];

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, FormsModule, PageHeroComponent, LazyImageDirective, RevealDirective],
  template: `
    <app-page-hero
      eyebrow="Products"
      title="Our Software Portfolio"
      subtitle="Discover our comprehensive suite of innovative software products designed to transform your business operations and drive digital excellence."
      backgroundImage="/images/backgrounds/services-bg.svg"
    />

    <section class="section">
      <div class="container">
        <div class="products-toolbar" appReveal="up">
          <input
            type="search"
            placeholder="Search solutions..."
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearchChange($event)"
            class="search-input"
            aria-label="Search solutions"
          />
          <span class="results-count">Showing {{ filteredServices().length }} of {{ services().length }} solutions</span>
        </div>

        <div class="grid grid--3" *ngIf="filteredServices().length; else spinner">
          <article class="card svc product-card" *ngFor="let service of filteredServices(); let i = index" appReveal="up" [appRevealDelay]="i * 80">
            <div class="product-card__header">
              <span class="badge badge--featured" *ngIf="service.is_featured">Featured</span>
              <span class="product-card__category">{{ getCategory(service.title) }}</span>
            </div>
            <div class="product-card__media" *ngIf="service.image">
              <img [src]="service.image" [alt]="service.title" loading="lazy" decoding="async" />
            </div>
            <div class="product-card__body">
              <h3>{{ service.title }}</h3>
              <p>{{ service.summary }}</p>
              <ul class="product-card__highlights" *ngIf="service.highlights?.length">
                <li *ngFor="let highlight of (service.highlights || []).slice(0, 3)">{{ highlight }}</li>
                <li *ngIf="(service.highlights || []).length > 3" class="more-highlights">+{{ (service.highlights || []).length - 3 }} more</li>
              </ul>
            </div>
            <div class="product-card__meta">
              <div class="meta-group">
                <span class="meta-label">Industry</span>
                <div class="meta-tags">{{ getIndustries(service.title).join(', ') }}</div>
              </div>
              <div class="meta-group">
                <span class="meta-label">Deployment</span>
                <div class="meta-tags">{{ getDeployments(service.title).join(', ') }}</div>
              </div>
            </div>
            <div class="product-card__actions">
              <a [routerLink]="['/services', service.slug]" class="btn btn--ghost btn--sm">Details</a>
              <a [routerLink]="['/contact']" [queryParams]="{ type: getOrderType(service.slug) }" class="btn btn--primary btn--sm">Message Us</a>
            </div>
          </article>
        </div>

        <ng-template #spinner>
          <div class="spinner"></div>
        </ng-template>
      </div>
    </section>

    <section class="section section--muted">
      <div class="container">
        <div class="comparison-table" appReveal="up">
          <h2>Product Comparison</h2>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th *ngFor="let service of featuredServices()">{{ service.title }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Industry</td>
                  <td *ngFor="let service of featuredServices()" [innerHTML]="getIndustries(service.title).join('<br/>')"></td>
                </tr>
                <tr>
                  <td>Key Features</td>
                  <td *ngFor="let service of featuredServices()">
                    <ul>
                      <li *ngFor="let h of (service.highlights || []).slice(0, 3)">{{ h }}</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td>Deployment</td>
                  <td *ngFor="let service of featuredServices()" [innerHTML]="getDeployments(service.title).join('<br/>')"></td>
                </tr>
                <tr>
                  <td>Implementation Time</td>
                  <td>4-6 weeks</td>
                  <td>6-8 weeks</td>
                  <td>8-12 weeks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="center" appReveal="up" [appRevealDelay]="100">
          <h3>Ready to Transform Your Business?</h3>
          <p class="muted-copy">Let's discuss how our tailored solutions can drive growth and efficiency for your organization</p>
          <a routerLink="/contact?context=sales" class="btn btn--primary btn--lg">Let's Talk</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .products-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .search-input {
      padding: 12px 16px;
      border: 1.5px solid var(--slate-300);
      border-radius: var(--radius-md);
      font-size: 0.95rem;
      min-width: 280px;
      background: var(--white);
      color: var(--navy-900);
      transition: all 0.2s ease;
    }
    .search-input:focus {
      border-color: var(--teal-400);
      box-shadow: 0 0 0 4px rgba(0, 172, 193, 0.12);
      outline: none;
    }
    .results-count { color: var(--slate-500); font-size: 0.9rem; }

    .grid--3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

    .product-card {
      display: flex;
      flex-direction: column;
      background: var(--white);
      border: 1px solid var(--slate-200);
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .product-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-lg);
      border-color: var(--slate-300);
    }
    .product-card__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px 20px 0;
      gap: 12px;
    }
    .badge--featured {
      background: linear-gradient(135deg, var(--amber-500), var(--amber-600));
      color: var(--white);
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .product-card__category {
      font-size: 0.75rem;
      color: var(--slate-500);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 600;
    }
    .product-card__media {
      aspect-ratio: 16 / 10;
      background: var(--slate-100);
      overflow: hidden;
    }
    .product-card__media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .product-card:hover .product-card__media img { transform: scale(1.06); }
    .product-card__body {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .product-card__body h3 {
      margin: 0 0 10px;
      font-size: 1.1rem;
      color: var(--navy-900);
    }
    .product-card__body p {
      color: var(--slate-600);
      font-size: 0.9rem;
      line-height: 1.6;
      margin: 0 0 16px;
      flex: 1;
    }
    .product-card__highlights {
      list-style: none;
      padding: 0;
      margin: 0 0 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .product-card__highlights li {
      font-size: 0.8rem;
      color: var(--slate-700);
      padding-left: 18px;
      position: relative;
    }
    .product-card__highlights li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--green-600);
      font-weight: 700;
      font-size: 0.85rem;
    }
    .more-highlights {
      color: var(--teal-500) !important;
      font-weight: 600;
    }
    .more-highlights::before { content: '+' !important; }
    .product-card__meta {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 0 20px 16px;
      border-top: 1px solid var(--slate-200);
      margin-top: auto;
    }
    .meta-group { display: flex; flex-direction: column; gap: 4px; }
    .meta-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
      color: var(--slate-500);
    }
    .meta-tags { font-size: 0.8rem; color: var(--slate-700); line-height: 1.5; }
    .product-card__actions {
      display: flex;
      gap: 10px;
      padding: 16px 20px;
      border-top: 1px solid var(--slate-200);
    }
    .product-card__actions .btn { flex: 1; text-align: center; }

    /* Comparison Table */
    .comparison-table { overflow-x: auto; }
    .table-wrapper { border: 1px solid var(--slate-200); border-radius: var(--radius-lg); overflow: hidden; }
    table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
    th, td {
      padding: 16px 20px;
      text-align: left;
      border-bottom: 1px solid var(--slate-200);
      vertical-align: top;
    }
    th {
      background: var(--slate-50);
      font-weight: 700;
      color: var(--navy-900);
      white-space: nowrap;
      min-width: 180px;
    }
    td { color: var(--slate-700); }
    td ul { margin: 0; padding-left: 18px; }
    td li { margin-bottom: 6px; line-height: 1.5; }
    td li:last-child { margin-bottom: 0; }
    tr:last-child td { border-bottom: none; }
    tr:nth-child(even) td { background: var(--slate-50); }

    @media (max-width: 1024px) {
      .grid--3 { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .grid--3 { grid-template-columns: 1fr; }
      .products-toolbar { flex-direction: column; align-items: stretch; }
      .search-input { min-width: 100%; }
    }
  `],
})
export class ServicesComponent {
  private readonly api = inject(ApiService);

  readonly servicesFromApi = toSignal(this.api.services().pipe(catchError(() => of([] as Service[]))), {
    initialValue: [] as Service[],
  });

  readonly services = computed(() => {
    const apiData = this.servicesFromApi();
    return apiData.length > 0 ? apiData : MOCK_SERVICES;
  });

  searchTerm = '';

  readonly filteredServices = computed(() => {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.services();
    return this.services().filter(s =>
      s.title.toLowerCase().includes(term) ||
      s.summary.toLowerCase().includes(term) ||
      s.highlights?.some(h => h.toLowerCase().includes(term))
    );
  });

  readonly featuredServices = computed(() => this.services().filter(s => s.is_featured).slice(0, 3));

  onSearchChange(term: string) {
    this.searchTerm = term;
  }

  icon(name: string | null): string {
    return iconGlyph(name);
  }

  getCategory(title: string): string {
    const categories: Record<string, string> = {
      'Otuya Global POS': 'Retail Technology',
      'Otuya Global Financials': 'Financial Technology',
      'Otuya Global e-Health Hospital ERP': 'Healthcare Technology',
      'Otuya Global Insure': 'Insurance Technology',
      'Otuya Global Pension Management System': 'Financial Technology',
      'Otuya Global Manufacturing ERP': 'Enterprise Solutions',
      'Otuya Global Customer Relationship Management (CRM)': 'Business Software',
      'Otuya Global Case & Contract Management': 'Legal Technology',
      'Otuya Global Academics': 'Education Technology',
    };
    return categories[title] || 'Software';
  }

  getIndustries(title: string): string[] {
    const industries: Record<string, string[]> = {
      'Otuya Global POS': ['Retail', 'Distribution', 'Wholesale', 'Hospitality'],
      'Otuya Global Financials': ['Financial Services'],
      'Otuya Global e-Health Hospital ERP': ['Healthcare'],
      'Otuya Global Insure': ['Financial Services', 'Insurance'],
      'Otuya Global Pension Management System': ['Financial Services'],
      'Otuya Global Manufacturing ERP': ['Manufacturing'],
      'Otuya Global Customer Relationship Management (CRM)': ['All Industries'],
      'Otuya Global Case & Contract Management': ['Legal', 'Corporate', 'Government'],
      'Otuya Global Academics': ['Education'],
    };
    return industries[title] || ['General'];
  }

  getDeployments(title: string): string[] {
    const deployments: Record<string, string[]> = {
      'Otuya Global POS': ['SaaS', 'Cloud', 'Hybrid', 'On-premise'],
      'Otuya Global Financials': ['Software-as-a-Service (SaaS)', 'Cloud Virtual Server', 'On-premise Hardware'],
      'Otuya Global e-Health Hospital ERP': ['SaaS', 'Cloud', 'On-premise'],
      'Otuya Global Insure': ['SaaS', 'Cloud'],
      'Otuya Global Pension Management System': ['SaaS', 'Cloud', 'On-premise'],
      'Otuya Global Manufacturing ERP': ['SaaS', 'Cloud', 'On-premise'],
      'Otuya Global Customer Relationship Management (CRM)': ['SaaS', 'Cloud'],
      'Otuya Global Case & Contract Management': ['SaaS', 'Cloud', 'On-premise'],
      'Otuya Global Academics': ['SaaS', 'Cloud'],
    };
    return deployments[title] || ['SaaS', 'Cloud'];
  }

  getOrderType(slug: string): string {
    const map: Record<string, string> = {
      'otuya-global-pos': 'pos',
      'otuya-global-financials': 'financials',
      'otuya-global-ehealth-hospital-erp': 'healthcare',
      'otuya-global-insure': 'insurance',
      'otuya-global-pension-management': 'pension',
      'otuya-global-manufacturing-erp': 'manufacturing',
      'otuya-global-crm': 'crm',
      'otuya-global-case-contract-management': 'legal',
      'otuya-global-academics': 'education',
    };
    return map[slug] ?? 'other';
  }
}