import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Service } from '../../core/models';
import { iconGlyph } from '../../core/icon-glyphs';
import { LazyImageDirective } from '../lazy-image/lazy-image.directive';

interface RotorCard {
  item: Service;
  offset: number;
  transform: string;
  filter: string;
  opacity: number;
  zIndex: number;
  isActive: boolean;
}

const MAX_VISIBLE = 2;
const AUTOPLAY_MS = 5200;
const DRAG_THRESHOLD_PX = 6;

@Component({
  selector: 'app-feature-rotator',
  standalone: true,
  imports: [RouterLink, LazyImageDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rotor" [class.rotor--reduced]="reducedMotion()" [style.--rotor-interval]="autoplayMs + 'ms'">
      <div
        #viewport
        class="rotor__viewport"
        tabindex="0"
        role="group"
        aria-roledescription="carousel"
        [attr.aria-label]="label()"
        [class.is-dragging]="dragging()"
        (pointerdown)="onPointerDown($event)"
        (pointermove)="onPointerMove($event)"
        (pointerup)="onPointerUp($event)"
        (pointercancel)="onPointerUp($event)"
        (mouseenter)="hovering.set(true)"
        (mouseleave)="hovering.set(false)"
        (focusin)="focusWithin.set(true)"
        (focusout)="onFocusOut($event)"
        (keydown)="onKeydown($event)"
      >
        <span class="rotor__floor" aria-hidden="true"></span>

        <div class="rotor__track">
          @for (card of cards(); track card.item.id) {
            <article
              class="rotor__card"
              [class.is-active]="card.isActive"
              [style.transform]="card.transform"
              [style.filter]="card.filter"
              [style.opacity]="card.opacity"
              [style.z-index]="card.zIndex"
              [attr.aria-hidden]="card.isActive ? null : 'true'"
            >
              <span class="rotor__halo" aria-hidden="true"></span>

              @if (card.item.image) {
                <div class="rotor__media">
                  <img [src]="card.item.image" [alt]="card.item.title" loading="lazy" appLazyImage />
                </div>
              }

              <div class="rotor__body">
                <span class="rotor__icon" aria-hidden="true">{{ glyph(card.item.icon) }}</span>
                <h3>{{ card.item.title }}</h3>
                <p>{{ card.item.summary }}</p>
                <a
                  class="rotor__link"
                  [routerLink]="['/services', card.item.slug]"
                  [tabindex]="card.isActive ? 0 : -1"
                  (click)="onCardClick($event)"
                >
                  Learn more
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </article>
          }
        </div>
      </div>

      <div class="rotor__controls">
        <div class="rotor__progress" aria-hidden="true">
          <span
            class="rotor__progress-bar"
            [class.is-alt-tick]="progressTick() % 2 === 1"
            [class.is-paused]="!running()"
          ></span>
        </div>

        <div class="rotor__navs">
          <button
            class="rotor__nav"
            type="button"
            (click)="prev()"
            [disabled]="count() < 2"
            aria-label="Previous feature"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <polyline points="15 5 8 12 15 19" />
            </svg>
          </button>

          <div class="rotor__dots">
            @for (item of items(); track item.id) {
              <button
                class="rotor__dot"
                type="button"
                [class.is-active]="$index === index()"
                [attr.aria-label]="'Show ' + item.title"
                [attr.aria-current]="$index === index() ? 'true' : null"
                (click)="goTo($index)"
              ></button>
            }
          </div>

          <button
            class="rotor__nav"
            type="button"
            (click)="next()"
            [disabled]="count() < 2"
            aria-label="Next feature"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <polyline points="9 5 16 12 9 19" />
            </svg>
          </button>
        </div>
      </div>

      <p class="sr-only" aria-live="polite">
        Feature {{ index() + 1 }} of {{ count() }}: {{ active()?.title }}
      </p>
    </div>
  `,
  styleUrl: './feature-rotator.component.scss',
})
export class FeatureRotatorComponent {
  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');

  readonly items = input.required<Service[]>();
  readonly label = input('Featured capabilities');
  readonly autoplay = input(true);

  readonly index = signal(0);
  readonly dragging = signal(false);
  readonly hovering = signal(false);
  readonly focusWithin = signal(false);
  readonly reducedMotion = signal(false);
  readonly inView = signal(true);
  readonly progressTick = signal(0);

  private readonly dragSteps = signal(0);
  private pointerStartX = 0;
  private pointerStartSteps = 0;
  private cardStepPx = 320;
  private moved = false;

  readonly autoplayMs = AUTOPLAY_MS;
  readonly count = computed(() => this.items().length);
  readonly active = computed<Service | null>(() => this.items()[this.index()] ?? null);

  /** Autoplay is only actually advancing when every pause condition is clear. */
  readonly running = computed(
    () =>
      this.autoplay() &&
      !this.reducedMotion() &&
      !this.hovering() &&
      !this.focusWithin() &&
      !this.dragging() &&
      this.inView(),
  );

  readonly cards = computed<RotorCard[]>(() => {
    const items = this.items();
    const total = items.length;
    const position = this.index() + this.dragSteps();

    return items.map((item, i) => {
      let offset = i - position;
      if (total > 1) {
        if (offset > total / 2) offset -= total;
        if (offset < -total / 2) offset += total;
      }

      const distance = Math.abs(offset);
      const isActive = distance < 0.5;

      // Gentler tilt and depth read as a ring rather than a collapsing stack.
      const tilt = Math.max(-MAX_VISIBLE, Math.min(MAX_VISIBLE, -offset * 10));
      const depth = -distance * 110;
      const scale = Math.max(0.72, 1 - distance * 0.11);
      const opacity = distance > MAX_VISIBLE + 0.35 ? 0 : Math.max(0, 1 - distance * 0.32);

      // Depth lighting: side cards fall off in brightness and blur so the 3D
      // reads as a real cylinder instead of flat overlapping panels.
      const brightness = Math.max(0.6, 1 - distance * 0.17);
      const blur = distance > 1.05 ? Math.min(3.2, (distance - 1) * 2.4) : 0;

      return {
        item,
        offset,
        isActive,
        opacity: Number(opacity.toFixed(3)),
        zIndex: 20 - Math.round(distance * 10),
        filter:
          'brightness(' + brightness.toFixed(2) + ')' +
          (blur > 0 ? ' blur(' + blur.toFixed(2) + 'px)' : ''),
        transform:
          `translate3d(calc(-50% + ${offset.toFixed(3)} * (100% + var(--rotor-gap))), -50%, ${depth.toFixed(1)}px) ` +
          `rotateY(${tilt.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
      };
    });
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    if (typeof matchMedia !== 'undefined') {
      const query = matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion.set(query.matches);
      const onChange = (event: MediaQueryListEvent) => this.reducedMotion.set(event.matches);
      query.addEventListener('change', onChange);
      destroyRef.onDestroy(() => query.removeEventListener('change', onChange));
    }

    effect((onCleanup) => {
      if (this.count() < 2 || !this.running() || typeof window === 'undefined') return;

      const timer = window.setInterval(() => this.next(), AUTOPLAY_MS);
      onCleanup(() => window.clearInterval(timer));
    });

    effect(() => {
      const total = this.count();
      if (total > 0 && this.index() > total - 1) this.index.set(total - 1);
    });

    // Stop the ring entirely while it is scrolled out of view.
    effect((onCleanup) => {
      const el = this.viewport()?.nativeElement;
      if (!el || typeof IntersectionObserver === 'undefined') return;

      const observer = new IntersectionObserver(
        (entries) => this.inView.set(entries[0]?.isIntersecting ?? true),
        { threshold: 0.15 },
      );
      observer.observe(el);
      onCleanup(() => observer.disconnect());
    });
  }

  glyph(name: string | null): string {
    return iconGlyph(name);
  }

  next(): void {
    this.moveBy(1);
  }

  prev(): void {
    this.moveBy(-1);
  }

  goTo(position: number): void {
    this.setIndex(position);
  }

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        this.next();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.prev();
        break;
      case 'Home':
        event.preventDefault();
        this.goTo(0);
        break;
      case 'End':
        event.preventDefault();
        this.goTo(this.count() - 1);
        break;
      default:
        break;
    }
  }

  onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && this.viewport()?.nativeElement.contains(next)) return;
    this.focusWithin.set(false);
  }

  onCardClick(event: MouseEvent): void {
    if (!this.moved) return;
    event.preventDefault();
    this.moved = false;
  }

  onPointerDown(event: PointerEvent): void {
    if (this.reducedMotion()) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const viewport = this.viewport()?.nativeElement;
    if (!viewport) return;

    this.cardStepPx = this.measureStep();
    this.pointerStartX = event.clientX;
    this.pointerStartSteps = this.dragSteps();
    this.dragging.set(true);
    this.moved = false;
    viewport.setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.dragging()) return;
    const delta = event.clientX - this.pointerStartX;
    if (!this.moved && Math.abs(delta) < DRAG_THRESHOLD_PX) return;
    this.moved = true;
    event.preventDefault();
    this.dragSteps.set(this.pointerStartSteps - delta / Math.max(this.cardStepPx, 90));
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.dragging()) return;
    const viewport = this.viewport()?.nativeElement;
    if (viewport?.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    this.dragging.set(false);

    const steps = Math.round(this.dragSteps());
    this.dragSteps.set(0);
    if (this.moved && steps !== 0) this.moveBy(steps);
  }

  /** Single entry point for index changes so the progress bar always restarts. */
  private setIndex(next: number): void {
    const normalized = this.normalize(next);
    if (normalized === this.index()) return;
    this.progressTick.update((n) => n + 1);
    this.index.set(normalized);
  }

  private moveBy(delta: number): void {
    this.setIndex(this.index() + delta);
  }

  private normalize(position: number): number {
    const total = this.count();
    if (total <= 0) return 0;
    return ((position % total) + total) % total;
  }

  private measureStep(): number {
    const viewport = this.viewport()?.nativeElement;
    if (!viewport) return 320;

    const card = viewport.querySelector<HTMLElement>('.rotor__card');
    if (!card) return viewport.clientWidth || 320;

    const gap = parseFloat(getComputedStyle(card).getPropertyValue('--rotor-gap')) || 28;
    return card.getBoundingClientRect().width + gap;
  }
}