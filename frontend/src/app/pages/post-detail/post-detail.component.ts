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
    title: 'Microservices at scale: when to decompose and when to hold back',
    slug: 'microservices-at-scale-when-to-decompose-and-when-to-hold-back',
    excerpt: 'The decision to split a monolith is not just technical. It changes team dynamics, deployment complexity, and operational overhead.',
    body: 'The decision to split a monolith is not just technical. It changes team dynamics, deployment complexity, and operational overhead. This guide covers when to decompose, when to hold back, and how to make the transition successfully.',
    image: 'images/posts/legacy-rewrite-or-retire.svg?v=4',
    is_published: true,
    published_at: '2026-10-14',
    views: 3200,
    category: { id: 1, name: 'Engineering', slug: 'engineering', description: null },
    author: { id: 1, name: 'Michael TechLead', avatar: 'images/team/john-doe.svg' },
  },
  {
    id: 2,
    title: 'Data privacy in Africa: navigating GDPR, Kenya DPA, and sector regulations',
    slug: 'data-privacy-africa-gdpr-kenya-dpa-sector-regulations',
    excerpt: 'African businesses handling EU or Kenyan citizen data must comply with overlapping regulations. Here\'s how to build compliance into your product from day one.',
    body: 'African businesses handling EU or Kenyan citizen data must comply with overlapping regulations. Here\'s how to build compliance into your product from day one.',
    image: 'images/posts/infrastructure-as-code.svg?v=4',
    is_published: true,
    published_at: '2026-10-12',
    views: 2800,
    category: { id: 2, name: 'Security', slug: 'security', description: null },
    author: { id: 2, name: 'Abdullahi Suleiman', avatar: 'images/team/sipho-ndlovu.svg' },
  },
  {
    id: 3,
    title: 'Building inclusive products: designing for East Africa\'s linguistic diversity',
    slug: 'building-inclusive-products-east-africa-linguistic-diversity',
    excerpt: 'With over 100 languages spoken in East Africa, designing inclusive digital products requires more than translation.',
    body: 'With over 100 languages spoken in East Africa, designing inclusive digital products requires more than translation.',
    image: 'images/real/team-meeting.jpg?v=4',
    is_published: true,
    published_at: '2026-10-10',
    views: 1900,
    category: { id: 1, name: 'Engineering', slug: 'engineering', description: null },
    author: { id: 3, name: 'Diana Mutua', avatar: 'images/team/chloe-adams.svg' },
  },
  {
    id: 4,
    title: 'Digital Transformation in Education: Next-Generation Campus Management',
    slug: 'digital-transformation-in-education-next-generation-campus-management',
    excerpt: 'How educational institutions across Africa are embracing technology for better student management and improved learning outcomes.',
    body: 'How educational institutions across Africa are embracing technology for better student management and improved learning outcomes.',
    image: 'images/posts/education-campus-management.svg?v=4',
    is_published: true,
    published_at: '2026-05-17',
    views: 5400,
    category: { id: 3, name: 'Education', slug: 'education', description: null },
    author: { id: 4, name: 'Prof. Linda Akinyi', avatar: 'images/team/mary-smith.svg' },
  },
  {
    id: 5,
    title: 'Zero-trust architecture: a practical adoption guide for African businesses',
    slug: 'zero-trust-architecture-practical-adoption-guide-african-businesses',
    excerpt: 'Zero-trust is no longer a buzzword. Here\'s how to adopt it without shutting down your business.',
    body: 'Zero-trust is no longer a buzzword. Here\'s how to adopt it without shutting down your business.',
    image: 'images/posts/infrastructure-as-code.svg?v=4',
    is_published: true,
    published_at: '2026-10-11',
    views: 2100,
    category: { id: 2, name: 'Security', slug: 'security', description: null },
    author: { id: 5, name: 'Abdullahi Suleiman', avatar: 'images/team/sipho-ndlovu.svg' },
  },
  {
    id: 6,
    title: 'Why we write tests before we write features',
    slug: 'why-we-write-tests-before-we-write-features',
    excerpt: 'The real return on testing is not fewer bugs. It is the confidence to change code you did not write.',
    body: 'The real return on testing is not fewer bugs. It is the confidence to change code you did not write.',
    image: 'images/posts/tests-before-features.svg?v=4',
    is_published: true,
    published_at: '2026-10-02',
    views: 1750,
    category: { id: 1, name: 'Engineering', slug: 'engineering', description: null },
    author: { id: 6, name: 'Kevin Omondi', avatar: 'images/team/riaan-van-wyk.svg' },
  },
  {
    id: 7,
    title: 'Three cloud cost mistakes we see in every audit',
    slug: 'three-cloud-cost-mistakes-we-see-in-every-audit',
    excerpt: 'Orphaned storage, always-on non-production, and missing shutdown policies. Usually 20 to 40 percent of the bill.',
    body: 'Orphaned storage, always-on non-production, and missing shutdown policies. Usually 20 to 40 percent of the bill.',
    image: 'images/posts/cloud-cost-mistakes.svg?v=4',
    is_published: true,
    published_at: '2026-09-14',
    views: 3800,
    category: { id: 4, name: 'Cloud', slug: 'cloud', description: null },
    author: { id: 7, name: 'Kevin Omondi', avatar: 'images/team/riaan-van-wyk.svg' },
  },
  {
    id: 8,
    title: 'Buy versus build is a staffing decision',
    slug: 'buy-versus-build-is-a-staffing-decision',
    excerpt: 'The licence fee is the small part of the total. Ongoing maintenance is what decides it.',
    body: 'The licence fee is the small part of the total. Ongoing maintenance is what decides it.',
    image: 'images/posts/buy-versus-build.svg?v=4',
    is_published: true,
    published_at: '2026-08-27',
    views: 1420,
    category: { id: 5, name: 'Business', slug: 'business', description: null },
    author: { id: 8, name: 'Fanuel Otuya', avatar: 'images/team/fanuel-otuya.svg' },
  },
  {
    id: 9,
    title: 'Your backups are not tested until you have restored one',
    slug: 'your-backups-are-not-tested-until-you-have-restored-one',
    excerpt: 'A green backup dashboard proves the job ran. It says nothing about whether the data is recoverable.',
    body: 'A green backup dashboard proves the job ran. It says nothing about whether the data is recoverable.',
    image: 'images/posts/backup-restore-drill.svg?v=4',
    is_published: true,
    published_at: '2026-08-08',
    views: 2210,
    category: { id: 2, name: 'Security', slug: 'security', description: null },
    author: { id: 9, name: 'Abdullahi Suleiman', avatar: 'images/team/sipho-ndlovu.svg' },
  },
];

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, DatePipe, PostCardComponent, RevealDirective],
  template: `
    <ng-container *ngIf="resolvedPost() as p; else loading">
      <article class="section article">
        <div class="article__hero" [style.background-image]="'url(' + (p.image || 'images/placeholders/blog-placeholder.svg') + ')'"></div>
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
