import { Component, inject, input, computed, signal } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { RevealDirective } from '../../shared/reveal/reveal.directive';
import { LazyImageDirective } from '../../shared/lazy-image/lazy-image.directive';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { Project } from '../../core/models';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, DatePipe, LazyImageDirective, RevealDirective],
  template: `
    <ng-container *ngIf="resolvedProject() as p; else loading">
      <section class="hero">
        <div class="hero__bg" [style.background-image]="'url(' + (p.cover_image || '/images/placeholders/project-placeholder.svg') + ')'"></div>
        <div class="container">
          <nav class="crumbs">
            <a routerLink="/projects">Projects</a>
            <span>/</span>
            <span>{{ p.title }}</span>
          </nav>
          <h1 appReveal="mask">{{ p.title }}</h1>
          <div class="hero__meta">
            <span class="badge badge--light" *ngIf="p.client">{{ p.client }}</span>
            <span class="hero__date" *ngIf="p.completed_at">
              Completed {{ p.completed_at | date: 'MMMM y' }}
            </span>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container detail">
          <article class="detail__body">
            <figure class="detail__media" *ngIf="p.cover_image">
              <img [src]="p.cover_image" [alt]="p.title" loading="lazy" decoding="async" />
            </figure>
            <p class="lead" appReveal="mask" [appRevealDelay]="80">{{ p.summary }}</p>
            <p *ngFor="let paragraph of paragraphs(p.body)">{{ paragraph }}</p>

            <ng-container *ngIf="p.technologies?.length">
              <h2 appReveal="mask">Technology</h2>
              <div class="tags">
                <span class="badge" *ngFor="let tech of p.technologies">{{ tech }}</span>
              </div>
            </ng-container>

            <ng-container *ngIf="p.gallery?.length">
              <h2 appReveal="mask">Gallery</h2>
              <div class="gallery">
                <img *ngFor="let img of p.gallery" [src]="img" [alt]="p.title" loading="lazy" decoding="async" />
              </div>
            </ng-container>
          </article>

          <aside class="detail__side">
            <div class="card" appReveal="right">
              <h3>Discuss a similar project</h3>
              <p>If this is close to what you need, we can talk through scope and approach.</p>
            </div>
            <div class="card" *ngIf="p.project_url" appReveal="right" [appRevealDelay]="90">
              <h3>Visit the project</h3>
              <a [href]="p.project_url" target="_blank" rel="noopener" class="btn btn--ghost btn--block">
                Open site
              </a>
            </div>
            <div class="card" appReveal="right" [appRevealDelay]="180">
              <h3>More work</h3>
              <a *ngFor="let other of related()" [routerLink]="['/projects', other.slug]" class="related">
                {{ other.title }}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </ng-container>

    <ng-template #loading>
      <div class="spinner" *ngIf="!notFound()"></div>
      <section class="notfound" *ngIf="notFound()">
        <div class="container notfound__inner">
          <h1>Project not found</h1>
          <p>We could not find a project at this address. It may have been unpublished, or the link that brought you here may be out of date.</p>
          <div class="notfound__actions">
            <a routerLink="/projects" class="btn btn--ghost">All projects</a>
          </div>
        </div>
      </section>
    </ng-template>
  `,
  styles: [
    `
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
      .hero h1 { color: var(--white); margin-bottom: 18px; font-size: clamp(2rem, 5vw, 3rem); }
      .hero__meta { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-top: 16px; }
      .badge--light { background: rgba(255, 255, 255, 0.16); color: var(--white); }
      .hero__date { font-size: 0.9rem; color: #b6c6da; }
      .crumbs { display: flex; gap: 9px; font-size: 0.85rem; margin-bottom: 22px; color: #93a5bd; }
      .crumbs a { color: #cbd5e1; transition: color var(--transition-fast); }
      .crumbs a:hover { color: var(--pink-400); }

      .detail { display: grid; grid-template-columns: 1.6fr 1fr; gap: 52px; align-items: start; }
      .lead { font-size: 1.12rem; color: var(--slate-900); font-weight: 500; margin-bottom: 24px; }
      .detail__body p { color: var(--slate-700); line-height: 1.8; margin-bottom: 16px; }
      .detail__body h2 { margin: 32px 0 16px; font-size: 1.4rem; }
      .detail__body h2:first-child { margin-top: 0; }
      .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
      .detail__media { margin: 0 0 30px; }
      .detail__media img {
        width: 100%;
        height: auto;
        display: block;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow);
      }
      .gallery { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 16px; }
      .gallery img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
        transition: transform var(--transition-normal);
      }
      .gallery img:hover { transform: scale(1.02); }
      .detail__side { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 96px; }
      .detail__side p { font-size: 0.92rem; color: var(--slate-500); }
      .related { display: block; padding: 11px 0; border-bottom: 1px solid var(--slate-200); font-size: 0.93rem; color: var(--navy-700); transition: color var(--transition-fast), padding-left var(--transition-fast); }
      .related:hover { color: var(--pink-600); padding-left: 4px; }
      .related:last-child { border-bottom: 0; }

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

      @media (max-width: 900px) {
        .detail { grid-template-columns: 1fr; gap: 34px; }
        .detail__side { position: static; }
        .gallery { grid-template-columns: 1fr; }
      }
      @media (max-width: 640px) {
        .hero { padding: 70px 0 60px; }
        .notfound { padding: 60px 0 70px; }
        .notfound__inner { padding: 36px 24px; }
      }
    `,
  ],
})
export class ProjectDetailComponent {
  private readonly api = inject(ApiService);

  readonly slug = input.required<string>();

  readonly loaded = signal(false);

  readonly project = toSignal(
    toObservable(this.slug).pipe(
      switchMap((slug) => this.api.project(slug).pipe(catchError(() => of(null)))),
      tap(() => this.loaded.set(true)),
    ),
    { initialValue: null as Project | null },
  );

  private readonly allFromApi = toSignal(
    this.api.projects(6).pipe(
      catchError(() => of(null)),
    ),
    { initialValue: null },
  );

  readonly all = computed(() => this.allFromApi()?.data ?? []);

  readonly resolvedProject = computed(() => this.project());

  readonly notFound = computed(() => this.loaded() && !this.resolvedProject());

  paragraphs(body: string | null): string[] {
    return (body ?? '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  }

  related(): Project[] {
    const current = this.resolvedProject();
    return this.all().filter((p) => p.id !== current?.id).slice(0, 5);
  }
}