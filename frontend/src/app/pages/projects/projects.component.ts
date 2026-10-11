import { Component, inject, signal, computed } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Paginated, Project } from '../../core/models';
import { PageHeroComponent } from '../../shared/page-hero/page-hero.component';
import { LazyImageDirective } from '../../shared/lazy-image/lazy-image.directive';
import { RevealDirective } from '../../shared/reveal/reveal.directive';
import { finalize } from 'rxjs/operators';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, DatePipe, PageHeroComponent, LazyImageDirective, RevealDirective],
  template: `
    <app-page-hero
      eyebrow="Projects"
      title="Technology solutions engineered for real businesses"
      subtitle="Systems we have built for clients across industries. Same discipline, same accountability."
      backgroundImage="/images/backgrounds/section-bg.svg"
    />

    <section class="section" id="case-studies">
      <div class="container">
        <!-- Filter Tabs -->
        <div class="projects-filter" role="tablist" aria-label="Filter projects by category">
          <button
            class="filter-tab"
            *ngFor="let filter of filters"
            [class.active]="activeFilter() === filter.value"
            (click)="setFilter(filter.value)"
            role="tab"
            [attr.aria-selected]="activeFilter() === filter.value"
          >
            {{ filter.label }}
            <span class="filter-count" *ngIf="filter.count > 0">{{ filter.count }}</span>
          </button>
        </div>

        <!-- Projects Grid -->
        <div class="projects-grid" *ngIf="filteredProjects().length; else spinner">
          <article class="project-card" *ngFor="let project of filteredProjects(); let i = index" appReveal="up" [appRevealDelay]="i * 70">
            <div class="project-card__media" *ngIf="project.cover_image">
              <img [src]="project.cover_image" [alt]="project.title" loading="lazy" decoding="async" />
              <span class="project-card__badge" *ngIf="project.is_featured">Featured</span>
            </div>
            <div class="project-card__body">
              <div class="project-card__meta">
                <span class="project-card__client" *ngIf="project.client">{{ project.client }}</span>
                <span class="project-card__date" *ngIf="project.completed_at">{{ project.completed_at | date: 'MMM yyyy' }}</span>
              </div>
              <h3 class="project-card__title">{{ project.title }}</h3>
              <p class="project-card__summary">{{ project.summary }}</p>
              <div class="project-card__tags">
                <span class="badge" *ngFor="let tech of project.technologies?.slice(0, 4)">{{ tech }}</span>
                <span class="badge badge--outline" *ngIf="project.technologies && project.technologies.length > 4">+{{ project.technologies.length - 4 }} more</span>
              </div>
              <a [routerLink]="['/projects', project.slug]" class="project-card__link">
                View case study
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </article>
        </div>

        <ng-template #spinner>
          <div class="spinner"></div>
        </ng-template>

        <div class="empty-state" *ngIf="!loading() && !filteredProjects().length">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-state__icon">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <h3>No projects yet</h3>
          <p>We are newly founded and our first case studies are still in the works. Talk to us about your project.</p>
        </div>

        <!-- Pagination -->
        <div class="pager" *ngIf="lastPage() > 1" appReveal="up">
          <button class="btn btn--ghost btn--sm" [disabled]="page() <= 1 || loading()" (click)="go(page() - 1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Previous
          </button>
          <span class="pager__info">
            Page {{ page() }} of {{ lastPage() }} · {{ totalProjects() }} projects
          </span>
          <button class="btn btn--ghost btn--sm" [disabled]="page() >= lastPage() || loading()" (click)="go(page() + 1)">
            Next
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        <!-- CTA -->
        <div class="projects-cta" appReveal="up">
          <p>Have a project in mind? We'd love to hear about it.</p>
          <a routerLink="/contact" class="btn btn--primary">Contact Us</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .projects-filter {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--slate-200);
    }

    .filter-tab {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 999px;
      border: 1px solid var(--slate-300);
      background: var(--white);
      font-family: inherit;
      font-size: 0.88rem;
      font-weight: 500;
      color: var(--slate-700);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-tab:hover {
      border-color: var(--blue-500);
      color: var(--blue-600);
    }

    .filter-tab.active {
      background: var(--navy-800);
      border-color: var(--navy-800);
      color: var(--white);
    }

    .filter-count {
      background: var(--slate-200);
      color: var(--slate-600);
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .filter-tab.active .filter-count {
      background: rgba(255, 255, 255, 0.2);
      color: var(--white);
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 28px;
    }

    .project-card {
      display: flex;
      flex-direction: column;
      background: var(--white);
      border: 1px solid var(--slate-200);
      border-radius: var(--radius-lg);
      overflow: hidden;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .project-card:hover {
      text-decoration: none;
      box-shadow: var(--shadow-lg);
      transform: translateY(-6px);
      border-color: var(--slate-300);
    }

    .project-card__media {
      position: relative;
      aspect-ratio: 16 / 10;
      background: var(--slate-100);
      overflow: hidden;
    }

    .project-card__media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .project-card:hover .project-card__media img {
      transform: scale(1.08);
    }

    .project-card__badge {
      position: absolute;
      top: 16px;
      right: 16px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 700;
      background: var(--amber-500);
      color: var(--white);
      box-shadow: var(--shadow-sm);
    }

    .project-card__body {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 24px;
      gap: 12px;
    }

    .project-card__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 0.8rem;
      color: var(--slate-500);
    }

    .project-card__client {
      font-weight: 600;
      color: var(--slate-700);
    }

    .project-card__title {
      margin: 0;
      font-size: 1.15rem;
      line-height: 1.3;
      transition: color 0.2s ease;
    }

    .project-card:hover .project-card__title {
      color: var(--blue-600);
    }

    .project-card__summary {
      margin: 0;
      color: var(--slate-600);
      font-size: 0.93rem;
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .project-card__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: auto;
      padding-top: 8px;
    }

    .project-card__tags .badge {
      transition: all 0.2s ease;
    }

    .project-card:hover .project-card__tags .badge:not(.badge--outline) {
      background: var(--blue-50);
      color: var(--blue-600);
    }

    .project-card__link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
      font-weight: 600;
      font-size: 0.88rem;
      color: var(--blue-600);
      transition: gap 0.2s ease;
    }

    .project-card:hover .project-card__link {
      gap: 10px;
    }

    .empty-state {
      text-align: center;
      padding: 80px 24px;
      color: var(--slate-500);
    }

    .empty-state__icon {
      margin-bottom: 16px;
      opacity: 0.4;
    }

    .empty-state h3 {
      margin-bottom: 8px;
      color: var(--slate-900);
    }

    .pager {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-top: 48px;
      font-size: 0.9rem;
      color: var(--slate-500);
    }

    .pager__info {
      white-space: nowrap;
    }

    .projects-cta {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-top: 64px;
      padding: 48px;
      background: var(--slate-50);
      border-radius: var(--radius-lg);
      text-align: center;
    }

    .projects-cta p {
      margin: 0;
      color: var(--slate-600);
      font-size: 1.05rem;
    }

    @media (max-width: 768px) {
      .projects-grid {
        grid-template-columns: 1fr;
      }

      .projects-filter {
        gap: 6px;
      }

      .filter-tab {
        padding: 6px 12px;
        font-size: 0.82rem;
      }
    }

    @media (max-width: 480px) {
      .projects-filter {
        justify-content: center;
      }
      .filter-tab {
        padding: 6px 10px;
        font-size: 0.78rem;
      }
    }
  `],
})
export class ProjectsComponent {
  private readonly api = inject(ApiService);

  readonly page = signal(1);
  readonly loading = signal(true);
  readonly response = signal<Paginated<Project> | null>(null);
  readonly activeFilter = signal('all');

  readonly projects = computed(() => this.response()?.data ?? []);

  readonly lastPage = computed(() => this.response()?.last_page ?? 1);

  readonly totalProjects = computed(() => this.response()?.total ?? 0);

  readonly filters = [
    { value: 'all', label: 'All', count: 0 },
    { value: 'featured', label: 'Featured', count: 0 },
    { value: 'fintech', label: 'FinTech', count: 0 },
    { value: 'healthcare', label: 'Healthcare', count: 0 },
    { value: 'ecommerce', label: 'E-Commerce', count: 0 },
  ];

  readonly filteredProjects = computed(() => {
    const all = this.projects();
    const filter = this.activeFilter();

    if (filter === 'all') return all;
    if (filter === 'featured') return all.filter(p => p.is_featured);
    return all.filter(p => p.slug?.includes(filter) || p.technologies?.some(t => t.toLowerCase().includes(filter)));
  });

  constructor() {
    this.load(this.page());
  }

  setFilter(filter: string) {
    this.activeFilter.set(filter);
    this.page.set(1);
  }

  go(page: number): void {
    if (page < 1 || page > this.lastPage()) return;
    this.page.set(page);
    this.load(page);
  }

  private load(page: number): void {
    this.loading.set(true);

    this.api
      .projects(12, false, page)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.response.set(res);
          this.updateFilterCounts(res.data);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: () => {
          this.response.set(null);
          this.updateFilterCounts([]);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
      });
  }

  private updateFilterCounts(projects: Project[]) {
    const counts = {
      all: projects.length,
      featured: projects.filter(p => p.is_featured).length,
      fintech: projects.filter(p => p.slug?.includes('fintech') || p.technologies?.some(t => t.toLowerCase().includes('fintech') || t.toLowerCase().includes('payment'))).length,
      healthcare: projects.filter(p => p.slug?.includes('health') || p.technologies?.some(t => t.toLowerCase().includes('health') || t.toLowerCase().includes('medical'))).length,
      ecommerce: projects.filter(p => p.slug?.includes('ecommerce') || p.slug?.includes('commerce') || p.technologies?.some(t => t.toLowerCase().includes('shop') || t.toLowerCase().includes('commerce'))).length,
    };

    this.filters.forEach(f => {
      (f as any).count = counts[f.value as keyof typeof counts] || 0;
    });
  }
}