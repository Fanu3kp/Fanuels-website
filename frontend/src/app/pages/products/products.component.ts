import { Component, computed } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PageHeroComponent } from '../../shared/page-hero/page-hero.component';
import { LazyImageDirective } from '../../shared/lazy-image/lazy-image.directive';
import { RevealDirective } from '../../shared/reveal/reveal.directive';
import { Service } from '../../core/models';

import { MOCK_PRODUCTS } from '../../core/mock-catalog';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, FormsModule, PageHeroComponent, LazyImageDirective, RevealDirective],
  template: `
    <app-page-hero
      eyebrow="Products"
      title="Our Software Portfolio"
      subtitle="Discover our comprehensive suite of innovative software products designed to transform your business operations and drive digital excellence."
      backgroundImage="images/backgrounds/services-bg.svg"
    />

    <section class="section">
      <div class="container">
        <div class="products-toolbar" appReveal="up">
          <input
            type="search"
            placeholder="Search products..."
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearchChange($event)"
            class="search-input"
            aria-label="Search products"
          />
          <span class="results-count">Showing {{ filteredProducts().length }} of {{ products().length }} products</span>
        </div>

        <div class="grid grid--3" *ngIf="filteredProducts().length; else spinner">
          <article class="card svc product-card" *ngFor="let product of filteredProducts(); let i = index">
            <div class="product-card__header">
              <span class="badge badge--featured" *ngIf="product.is_featured">Featured</span>
              <span class="product-card__category">{{ getCategory(product.title) }}</span>
            </div>
            <div class="product-card__media" *ngIf="true">
              <img [src]="product.image || 'images/real/coding-session.svg'" [alt]="product.title" loading="eager" decoding="async" />
            </div>
            <div class="product-card__body">
              <h3>{{ product.title }}</h3>
              <p>{{ product.summary }}</p>
              <ul class="product-card__highlights" *ngIf="product.highlights?.length">
                <li *ngFor="let highlight of (product.highlights || []).slice(0, 3)">{{ highlight }}</li>
                <li *ngIf="(product.highlights || []).length > 3" class="more-highlights">+{{ (product.highlights || []).length - 3 }} more</li>
              </ul>
            </div>
            <div class="product-card__meta">
              <div class="meta-group">
                <span class="meta-label">Industry</span>
                <div class="meta-tags">{{ getIndustries(product.title).join(', ') }}</div>
              </div>
              <div class="meta-group">
                <span class="meta-label">Deployment</span>
                <div class="meta-tags">{{ getDeployments(product.title).join(', ') }}</div>
              </div>
            </div>
            <div class="product-card__actions">
              <a [routerLink]="['/services', product.slug]" class="btn btn--ghost btn--sm">Details</a>
              <a [routerLink]="['/contact']" [queryParams]="{ type: getOrderType(product.slug) }" class="btn btn--primary btn--sm">Message Us</a>
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
                  <th *ngFor="let product of featuredProducts()">{{ product.title }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Industry</td>
                  <td *ngFor="let product of featuredProducts()" [innerHTML]="getIndustries(product.title).join('<br/>')"></td>
                </tr>
                <tr>
                  <td>Key Features</td>
                  <td *ngFor="let product of featuredProducts()">
                    <ul>
                      <li *ngFor="let h of (product.highlights || []).slice(0, 3)">{{ h }}</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td>Deployment</td>
                  <td *ngFor="let product of featuredProducts()" [innerHTML]="getDeployments(product.title).join('<br/>')"></td>
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
export class ProductsComponent {
  readonly products = computed(() => MOCK_PRODUCTS as Service[]);

  searchTerm = '';

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.products();
    return this.products().filter(p =>
      p.title.toLowerCase().includes(term) ||
      p.summary.toLowerCase().includes(term) ||
      p.highlights?.some(h => h.toLowerCase().includes(term))
    );
  });

  readonly featuredProducts = computed(() => this.products().filter(p => p.is_featured).slice(0, 3));

  onSearchChange(term: string) {
    this.searchTerm = term;
  }

  getCategory(title: string): string {
    const categories: Record<string, string> = {
      'Otuya POS': 'Retail Technology',
      'Otuya Financials': 'Financial Technology',
      'Otuya e-Health Hospital ERP': 'Healthcare Technology',
      'Otuya Insure': 'Insurance Technology',
      'Otuya Pension Management System': 'Financial Technology',
      'Otuya Manufacturing ERP': 'Enterprise Solutions',
      'Otuya CRM': 'Business Software',
      'Otuya Case & Contract Management': 'Legal Technology',
      'Otuya Academics': 'Education Technology',
    };
    return categories[title] || 'Software';
  }

  getIndustries(title: string): string[] {
    const industries: Record<string, string[]> = {
      'Otuya POS': ['Retail', 'Distribution', 'Wholesale', 'Hospitality'],
      'Otuya Financials': ['Financial Services'],
      'Otuya e-Health Hospital ERP': ['Healthcare'],
      'Otuya Insure': ['Financial Services', 'Insurance'],
      'Otuya Pension Management System': ['Financial Services'],
      'Otuya Manufacturing ERP': ['Manufacturing'],
      'Otuya CRM': ['All Industries'],
      'Otuya Case & Contract Management': ['Legal', 'Corporate', 'Government'],
      'Otuya Academics': ['Education'],
    };
    return industries[title] || ['General'];
  }

  getDeployments(title: string): string[] {
    const deployments: Record<string, string[]> = {
      'Otuya POS': ['SaaS', 'Cloud', 'Hybrid', 'On-premise'],
      'Otuya Financials': ['Software-as-a-Service (SaaS)', 'Cloud Virtual Server', 'On-premise Hardware'],
      'Otuya e-Health Hospital ERP': ['SaaS', 'Cloud', 'On-premise'],
      'Otuya Insure': ['SaaS', 'Cloud'],
      'Otuya Pension Management System': ['SaaS', 'Cloud', 'On-premise'],
      'Otuya Manufacturing ERP': ['SaaS', 'Cloud', 'On-premise'],
      'Otuya CRM': ['SaaS', 'Cloud'],
      'Otuya Case & Contract Management': ['SaaS', 'Cloud', 'On-premise'],
      'Otuya Academics': ['SaaS', 'Cloud'],
    };
    return deployments[title] || ['SaaS', 'Cloud'];
  }

  getOrderType(slug: string): string {
    const map: Record<string, string> = {
      'otuya-pos': 'pos',
      'otuya-financials': 'financials',
      'otuya-ehealth-hospital-erp': 'healthcare',
      'otuya-insure': 'insurance',
      'otuya-pension-management': 'pension',
      'otuya-manufacturing-erp': 'manufacturing',
      'otuya-crm': 'crm',
      'otuya-case-contract-management': 'legal',
      'otuya-academics': 'education',
    };
    return map[slug] ?? 'other';
  }
}


