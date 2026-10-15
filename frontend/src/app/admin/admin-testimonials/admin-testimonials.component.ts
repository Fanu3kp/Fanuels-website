import { Component, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ApiError, ApiService } from '../../core/api.service';
import { Testimonial } from '../../core/models';
import { RevealDirective } from '../../shared/reveal/reveal.directive';

@Component({
  selector: 'app-admin-testimonials',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, RevealDirective],
  template: `
    <div class="admin-head" appReveal="up">
      <div>
        <h1>Testimonials</h1>
        <p>Client quotes shown on the home page.</p>
      </div>
      <div class="admin-actions">
        <button class="btn btn--primary btn--sm" (click)="open()">Add testimonial</button>
      </div>
    </div>

    <div class="alert alert--error" *ngIf="error">{{ error }}</div>

    <div class="admin-card" appReveal="up" [appRevealDelay]="120">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Author</th>
            <th>Quote</th>
            <th>Order</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of testimonials()">
            <td>
              <strong>{{ item.author_name }}</strong>
              <div style="font-size:0.84rem;color:var(--slate-500)">
                {{ item.author_role }}<ng-container *ngIf="item.author_company">, {{ item.author_company }}</ng-container>
              </div>
            </td>
            <td style="max-width:320px">
              <div style="font-size:0.87rem;color:var(--slate-500)">
                {{ item.quote.length > 90 ? item.quote.slice(0, 90) + '...' : item.quote }}
              </div>
            </td>
            <td>{{ item.sort_order }}</td>
            <td>
              <button class="toggle" [class.toggle--on]="item.is_active" (click)="toggle(item)"
                [attr.aria-label]="'Toggle active for ' + item.author_name"></button>
            </td>
            <td>
              <div class="admin-table__actions">
                <button class="btn btn--ghost btn--sm" (click)="open(item)">Edit</button>
                <button class="btn btn--ghost btn--sm" (click)="remove(item)">Delete</button>
              </div>
            </td>
          </tr>
          <tr *ngIf="!testimonials().length && !loading()">
            <td colspan="5" style="text-align:center;color:var(--slate-500);padding:44px">No testimonials yet.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal-backdrop" *ngIf="editing()" (click)="close()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal__head">
          <h2>{{ form.get('id')?.value ? 'Edit testimonial' : 'Add testimonial' }}</h2>
          <button class="modal__close" (click)="close()" aria-label="Close">&times;</button>
        </div>

        <form [formGroup]="form">
          <div class="modal__body">
            <div class="form-grid">
              <div class="field">
                <label>Author name</label>
                <input formControlName="author_name" />
              </div>
              <div class="field">
                <label>Company</label>
                <input formControlName="author_company" />
              </div>
              <div class="field">
                <label>Role</label>
                <input formControlName="author_role" />
              </div>
              <div class="field">
                <label>Rating <span class="hint">(1-5)</span></label>
                <input formControlName="rating" type="number" min="1" max="5" />
              </div>
              <div class="field">
                <label>Sort order</label>
                <input formControlName="sort_order" type="number" min="0" />
              </div>
              <div class="field">
                <div class="checkbox">
                  <input id="test-active" type="checkbox" formControlName="is_active" />
                  <label for="test-active">Active</label>
                </div>
              </div>
              <div class="field full">
                <label>Quote</label>
                <textarea formControlName="quote" rows="5"></textarea>
              </div>
            </div>
          </div>

          <div class="modal__foot">
            <button class="btn btn--ghost btn--sm" (click)="close()">Cancel</button>
            <button class="btn btn--primary btn--sm" (click)="save()" [disabled]="saving()">
              {{ saving() ? 'Saving...' : 'Save testimonial' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="admin-toast" *ngIf="toast()">{{ toast() }}</div>
  `,
})
export class AdminTestimonialsComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  readonly testimonials = signal<Testimonial[]>([]);
  readonly loading = signal(true);
  readonly editing = signal(false);
  readonly saving = signal(false);
  readonly toast = signal('');
  error = '';

  readonly form = this.fb.nonNullable.group({
    id: [0],
    author_name: ['', Validators.required],
    author_role: [''],
    author_company: [''],
    quote: ['', Validators.required],
    rating: [5],
    sort_order: [0],
    is_active: [true],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.api.adminTestimonials().subscribe({
      next: (items) => {
        this.testimonials.set(items);
        this.loading.set(false);
      },
      error: (err: ApiError) => {
        this.error = err.message;
        this.loading.set(false);
      },
    });
  }

  open(item?: Testimonial): void {
    this.error = '';
    this.form.reset({
      id: 0,
      author_name: '',
      author_role: '',
      author_company: '',
      quote: '',
      rating: 5,
      sort_order: this.testimonials().length + 1,
      is_active: true,
    });

    if (item) {
      this.form.patchValue({
        id: item.id,
        author_name: item.author_name,
        author_role: item.author_role ?? '',
        author_company: item.author_company ?? '',
        quote: item.quote,
        rating: item.rating,
        sort_order: item.sort_order,
        is_active: item.is_active,
      });
    }

    this.editing.set(true);
  }

  close(): void {
    this.editing.set(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const payload: Partial<Testimonial> = {
      author_name: raw.author_name,
      author_role: raw.author_role || null,
      author_company: raw.author_company || null,
      quote: raw.quote,
      rating: raw.rating,
      sort_order: raw.sort_order,
      is_active: raw.is_active,
    };

    if (raw.id) {
      payload.id = raw.id;
    }

    this.saving.set(true);
    this.error = '';

    this.api
      .adminTestimonialSave(payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.editing.set(false);
          this.flash('Testimonial saved.');
          this.load();
        },
        error: (err: ApiError) => (this.error = err.firstError ?? err.message),
      });
  }

  toggle(item: Testimonial): void {
    this.api.adminTestimonialSave({ ...item, is_active: !item.is_active }).subscribe({
      next: () => this.load(),
      error: (err: ApiError) => (this.error = err.message),
    });
  }

  remove(item: Testimonial): void {
    if (!confirm(`Delete the testimonial from ${item.author_name}?`)) {
      return;
    }

    this.api.adminTestimonialDelete(item.id).subscribe({
      next: () => {
        this.flash('Testimonial deleted.');
        this.load();
      },
      error: (err: ApiError) => (this.error = err.message),
    });
  }

  private flash(message: string): void {
    this.toast.set(message);
    setTimeout(() => this.toast.set(''), 2600);
  }
}