import { Component, DestroyRef, NgZone, inject, signal, HostListener, effect, computed } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { APP_CONFIG } from '../../../environments/app-config.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface NavItem {
  label: string;
  route?: string;
  external?: boolean;
  fragment?: string;
  queryParams?: Record<string, string>;
  children?: NavItem[];
}

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  template: `
    <header class="header" [class.header--scrolled]="scrolled()" [class.header--dark]="darkHeader()">
      <div class="container header__inner">
        <a routerLink="/" class="brand" (click)="closeAll()">
          <svg class="brand__mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="ogMark" x1="0" y1="0" x2="1" y2="1" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="var(--pink-500)" />
                <stop offset="0.5" stop-color="var(--violet-500)" />
                <stop offset="1" stop-color="var(--pink-600)" />
              </linearGradient>
              <linearGradient id="ogMarkInner" x1="0" y1="0" x2="1" y2="1" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="var(--pink-600)" />
                <stop offset="1" stop-color="var(--teal-500)" />
              </linearGradient>
            </defs>
            <!-- Outer hexagon frame -->
            <path
              d="M32 4 L56.7 16 L56.7 48 L32 60 L7.3 48 L7.3 16 Z"
              fill="var(--navy-950)"
              stroke="url(#ogMark)"
              stroke-width="2.5"
            />
            <!-- Inner hexagon accent -->
            <path
              d="M32 12 L48.3 22 L48.3 42 L32 52 L15.7 42 L15.7 22 Z"
              fill="none"
              stroke="url(#ogMarkInner)"
              stroke-width="1.5"
              opacity="0.6"
            />
            <!-- Central "OG" monogram -->
            <text
              x="32"
              y="39"
              text-anchor="middle"
              dominant-baseline="central"
              font-family="var(--font-heading), Georgia, serif"
              font-size="30"
              font-weight="800"
              letter-spacing="-0.5"
            >
              OG
            </text>
          </svg>
          <span class="brand__text">
            <strong>Otuya Global</strong>
            <small>Technology & Business Group</small>
          </span>
        </a>

        <div class="nav-wrapper">
          <nav class="nav" [class.nav--open]="mobileOpen()">
            <ng-container *ngFor="let item of navItems">
              <ng-container *ngIf="item.children; else simpleLink">
                <div
                  class="nav-dropdown"
                  [class.open]="isDropdownOpen(item.label)"
                  (mouseenter)="onEnter(item.label)"
                  (mouseleave)="onLeave()"
                >
                  <button
                    class="nav-dropdown__trigger"
                    type="button"
                    (click)="onTriggerClick(item.label)"
                    (keydown)="onTriggerKeydown($event, item.label)"
                    [attr.aria-expanded]="isDropdownOpen(item.label)"
                    [attr.aria-controls]="panelId(item.label)"
                  >
                    {{ item.label }}
                    <svg class="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [class.rotated]="isDropdownOpen(item.label)">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  <div
                    class="nav-dropdown__panel"
                    [id]="panelId(item.label)"
                    (keydown)="onPanelKeydown($event)"
                  >
                    <div class="dropdown-grid">
                      <ng-container *ngFor="let child of item.children">
                        <a
                          *ngIf="child.route && !child.external"
                          [routerLink]="child.route"
                          [fragment]="child.fragment"
                          [queryParams]="child.queryParams"
                          routerLinkActive="is-active"
                          [routerLinkActiveOptions]="{ exact: true }"
                          class="dropdown-item"
                          (click)="onDropdownItemClick()"
                        >
                          {{ child.label }}
                        </a>
                        <a
                          *ngIf="child.external"
                          [href]="child.route"
                          target="_blank"
                          rel="noopener"
                          class="dropdown-item"
                          (click)="onDropdownItemClick()"
                        >
                          {{ child.label }}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="external-icon">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </a>
                      </ng-container>
                    </div>
                  </div>
                </div>
              </ng-container>

              <ng-template #simpleLink>
                <a
                  *ngIf="item.route && !item.external"
                  [routerLink]="item.route"
                  routerLinkActive="is-active"
                  [routerLinkActiveOptions]="{ exact: item.label === 'Home' }"
                  class="nav-link"
                  (click)="closeAll()"
                >
                  {{ item.label }}
                </a>
                <a
                  *ngIf="item.external"
                  [href]="item.route"
                  target="_blank"
                  rel="noopener"
                  class="nav-link"
                  (click)="closeAll()"
                >
                  {{ item.label }}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="external-icon">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </ng-template>
            </ng-container>
          </nav>

          <div class="header-actions">

            <button class="search-toggle" type="button" (click)="searchOpen.set(!searchOpen())" aria-label="Search" aria-expanded="searchOpen()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span class="search-toggle__text">Search</span>
            </button>

            <button
              class="nav-toggle"
              type="button"
              (click)="mobileOpen.set(!mobileOpen())"
              [attr.aria-expanded]="mobileOpen()"
              aria-label="Toggle navigation"
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Search Overlay -->
      <div class="search-overlay" [class.open]="searchOpen()" *ngIf="searchOpen()">
        <div class="search-overlay__inner">
          <form class="search-form" (submit)="onSearch($event)">
            <label for="site-search" class="sr-only">Search site</label>
            <input
              id="site-search"
              type="search"
              placeholder="Type to search anything..."
              [(ngModel)]="searchQuery"
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
          <div class="search-results" *ngIf="searchQuery.length >= 2">
            <div class="search-category">
              <h4>Quick Links</h4>
              <a
                *ngFor="let link of quickLinks()"
                [routerLink]="link.route"
                class="search-result-item"
                (click)="closeAll()"
              >{{ link.label }}</a>
              <p *ngIf="quickLinks().length === 0" class="search-empty">
                No quick matches — press Search to search the whole site.
              </p>
            </div>
          </div>
          <button class="search-close" type="button" (click)="searchOpen.set(false)" aria-label="Close search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  `,
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  readonly config = inject(APP_CONFIG);
  readonly mobileOpen = signal(false);
  readonly searchOpen = signal(false);
  readonly dropdownOpen = signal<string | null>(null);
  readonly scrolled = signal(false);
  readonly darkHeader = signal(false);
  searchQuery = '';

  private readonly router = inject(Router);

  private readonly QUICK_LINKS = [
    { label: 'Our Services', route: '/services', keywords: 'services it managed software cloud' },
    { label: 'Our Products', route: '/products', keywords: 'products otuya pos financials insure erp crm' },
    { label: 'Careers', route: '/careers', keywords: 'careers jobs vacancies join team' },
    { label: 'Our Projects', route: '/projects', keywords: 'projects portfolio work' },
    { label: 'Insights & Blog', route: '/insights', keywords: 'insights blog articles news' },
    { label: 'FAQ', route: '/faq', keywords: 'faq questions help support' },
    { label: 'Our Business', route: '/business', keywords: 'business units branches poultry agriculture' },
    { label: 'Structure', route: '/structure', keywords: 'structure organization units' },
    { label: 'About Us', route: '/about', keywords: 'about us company fanuel otuya' },
    { label: 'Contact Us', route: '/contact', keywords: 'contact get in touch email phone' },
  ];

  readonly quickLinks = computed(() => {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.QUICK_LINKS;
    return this.QUICK_LINKS.filter(
      (link) =>
        link.label.toLowerCase().includes(q) ||
        link.route.includes(q) ||
        link.keywords.includes(q),
    );
  });

  readonly navItems: NavItem[] = [
    { label: 'Home', route: '/' },
    { label: 'About Us', route: '/about' },
    {
      label: 'Services',
      children: [
        { label: 'IT Managed Services', route: '/contact', queryParams: { type: 'managed' } },
        { label: 'Custom Software Development', route: '/contact', queryParams: { type: 'software' } },
        { label: 'Cloud & Infrastructure', route: '/contact', queryParams: { type: 'cloud' } },
        { label: 'Business Process Automation', route: '/contact', queryParams: { type: 'automation' } },
        { label: 'System Integration Services', route: '/contact', queryParams: { type: 'integration' } },
        { label: 'Support & Maintenance (24/7)', route: '/contact', queryParams: { type: 'support' } },
        { label: 'Training & Capacity Building', route: '/contact', queryParams: { type: 'training' } },
        { label: 'Digital Transformation Consulting', route: '/contact', queryParams: { type: 'consulting' } },
      ],
    },
    {
      label: 'Resources',
      children: [
        { label: 'Insights & Blog', route: '/insights' },
        { label: 'FAQ', route: '/faq' },
      ],
    },
    { label: 'Products', route: '/products' },
    { label: 'Careers', route: '/careers' },
    { label: 'Contact', route: '/contact' },
  ];

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.closeAll();
        // The light hero photography on these pages makes a transparent or
        // white bar hard to read, so they get the dark glass variant.
        const path = (e as NavigationEnd).urlAfterRedirects.split('?')[0].split('#')[0];
        this.darkHeader.set(
          ['/insights', '/faq', '/about'].some(
            (prefix) => path === prefix || path.startsWith(prefix + '/'),
          ),
        );
      });

    const scrolled = this.scrolled;
    const zone = inject(NgZone);
    const destroyRef = inject(DestroyRef);
    zone.runOutsideAngular(() => {
      const onScroll = () => scrolled.set(window.scrollY > 12);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
    });

    effect(() => {
      // Lock the page behind both full-screen surfaces so they can be scrolled
      // independently instead of dragging the page underneath.
      const shouldLock = this.searchOpen() || this.mobileOpen();
      document.body.style.overflow = shouldLock ? 'hidden' : '';
    });
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeAll();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.nav-dropdown')) {
      this.dropdownOpen.set(null);
    }
    if (!target.closest('.search-overlay') && !target.closest('.search-toggle')) {
      this.searchOpen.set(false);
    }
  }

  toggleDropdown(label: string | null) {
    this.dropdownOpen.set(label);
  }

  /** Stable DOM id so triggers can point at their panel via aria-controls. */
  panelId(label: string): string {
    return 'navmenu-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  /**
   * Hover is only wired up on real pointing devices. On touch, mouseenter can
   * fire on tap and leave the panel stuck open, so hover must stay off there.
   */
  private readonly canHover =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  onEnter(label: string): void {
    if (this.canHover && !this.mobileOpen()) {
      this.dropdownOpen.set(label);
    }
  }

  onLeave(): void {
    if (this.canHover && !this.mobileOpen()) {
      this.dropdownOpen.set(null);
    }
  }

  /** Click works everywhere - hover is a progressive enhancement, not the only way in. */
  onTriggerClick(label: string): void {
    if (this.isDropdownOpen(label)) {
      this.dropdownOpen.set(null);
    } else {
      this.dropdownOpen.set(label);
    }
  }

  onTriggerKeydown(event: KeyboardEvent, label: string): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.dropdownOpen.set(label);
        this.focusItem(label, 0);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.dropdownOpen.set(label);
        this.focusItem(label, -1);
        break;
      case 'Escape':
      case 'Esc':
        if (this.isDropdownOpen(label)) {
          event.preventDefault();
          this.dropdownOpen.set(null);
        }
        break;
      case 'Tab':
        this.dropdownOpen.set(null);
        break;
    }
  }

  /**
   * Arrow/Home/End walk the links once a panel is open, so a keyboard user never
   * has to Tab through every item just to reach the last one. Escape hands focus
   * back to the trigger that opened the panel.
   */
  onPanelKeydown(event: KeyboardEvent): void {
    const panel = (event.target as HTMLElement).closest(
      '.nav-dropdown__panel',
    ) as HTMLElement | null;
    if (!panel) return;

    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      const trigger = panel.parentElement?.querySelector<HTMLElement>('button');
      this.dropdownOpen.set(null);
      trigger?.focus();
      return;
    }

    const items = this.panelItems(panel);
    if (!items.length) return;
    const current = items.indexOf(document.activeElement as HTMLElement);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        items[Math.min(current + 1, items.length - 1)]?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        items[Math.max(current - 1, 0)]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        items[0].focus();
        break;
      case 'End':
        event.preventDefault();
        items[items.length - 1].focus();
        break;
      case 'Tab':
        this.dropdownOpen.set(null);
        break;
    }
  }

  private panelItems(panel: HTMLElement): HTMLElement[] {
    return Array.from(panel.querySelectorAll<HTMLElement>('a[href]'));
  }

  private focusItem(label: string, index: number): void {
    this.focusPanelItem(this.panelId(label), index);
  }

  /**
   * The open class is applied during change detection, which runs after the
   * keydown handler. Focusing too early targets a `visibility: hidden` panel,
   * where the browser silently refuses focus - so retry across frames until
   * focus lands, or give up once the panel has had time to appear.
   */
  private focusPanelItem(panelId: string, index: number): void {
    const MAX_FRAMES = 12;
    const attempt = (triesLeft: number) => {
      const panel = document.getElementById(panelId);
      if (!panel) return;
      const items = this.panelItems(panel);
      if (!items.length) return;
      const target =
        index < 0 ? items[items.length - 1] : items[Math.min(index, items.length - 1)];
      target.focus();
      if (document.activeElement !== target && triesLeft > 0) {
        requestAnimationFrame(() => attempt(triesLeft - 1));
      }
    };
    requestAnimationFrame(() => attempt(MAX_FRAMES));
  }

  isDropdownOpen(label: string): boolean {
    return this.dropdownOpen() === label;
  }

  onDropdownItemClick() {
    setTimeout(() => this.closeAll(), 100);
  }

  onSearch(event: Event) {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
      this.closeAll();
    }
  }

  closeAll() {
    this.mobileOpen.set(false);
    this.dropdownOpen.set(null);
    this.searchOpen.set(false);
    this.searchQuery = '';
  }
}
