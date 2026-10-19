import { Component, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ApiError, ApiService } from '../../core/api.service';
import { Service } from '../../core/models';
import { RevealDirective } from '../../shared/reveal/reveal.directive';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, RevealDirective],
  template: `
    <div class="admin-head" appReveal="up">
      <div>
        <h1>Services</h1>
        <p>Manage the service lines shown across the site.</p>
      </div>
      <div class="admin-actions">
        <button class="btn btn--primary btn--sm" (click)="open()">Add service</button>
      </div>
    </div>

    <div class="alert alert--error" *ngIf="error">{{ error }}</div>

    <div class="admin-card" appReveal="up" [appRevealDelay]="120">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Order</th>
            <th>Featured</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of services()">
            <td>
              <strong>{{ item.title }}</strong>
              <div style="font-size:0.84rem;color:var(--slate-500)">/{{ item.slug }}</div>
            </td>
            <td>{{ item.sort_order }}</td>
            <td>
              <button
                class="toggle"
                [class.toggle--on]="item.is_featured"
                (click)="toggle(item, 'is_featured')"
                [attr.aria-label]="'Toggle featured for ' + item.title"
              ></button>
            </td>
            <td>
              <button
                class="toggle"
                [class.toggle--on]="item.is_active"
                (click)="toggle(item, 'is_active')"
                [attr.aria-label]="'Toggle active for ' + item.title"
              ></button>
            </td>
            <td>
              <div class="admin-table__actions">
                <button class="btn btn--ghost btn--sm" (click)="open(item)">Edit</button>
                <button class="btn btn--ghost btn--sm" (click)="remove(item)">Delete</button>
              </div>
            </td>
          </tr>
          <tr *ngIf="!services().length && !loading()">
            <td colspan="5" style="text-align:center;color:var(--slate-500);padding:44px">
              No services yet. Add your first one.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal-backdrop" *ngIf="editing()" (click)="close()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal__head">
          <h2>{{ form.get('id')?.value ? 'Edit service' : 'Add service' }}</h2>
          <button class="modal__close" (click)="close()" aria-label="Close">&times;</button>
        </div>

        <form [formGroup]="form">
          <div class="modal__body">
            <div class="form-grid">
              <div class="field full">
                <label>Title</label>
                <input formControlName="title" />
              </div>
              <div class="field full">
                <label>Slug <span class="hint">(left blank, generated from title)</span></label>
                <input formControlName="slug" />
              </div>
              <div class="field full">
                <label>Summary</label>
                <textarea formControlName="summary" rows="3"></textarea>
              </div>
              <div class="field full">
                <label>Body</label>
                <textarea formControlName="body" rows="8" placeholder="Separate paragraphs with a blank line"></textarea>
              </div>
              <div class="field">
                <label>Icon key</label>
                <input formControlName="icon" placeholder="code, cloud, chart..." />
              </div>
              <div class="field">
                <label>Sort order</label>
                <input formControlName="sort_order" type="number" min="0" />
              </div>
              <div class="field full">
                <label>Highlights <span class="hint">(one per line)</span></label>
                <textarea formControlName="highlightsText" rows="5"></textarea>
              </div>
              <div class="field">
                <div class="checkbox">
                  <input id="svc-featured" type="checkbox" formControlName="is_featured" />
                  <label for="svc-featured">Featured</label>
                </div>
              </div>
              <div class="field">
                <div class="checkbox">
                  <input id="svc-active" type="checkbox" formControlName="is_active" />
                  <label for="svc-active">Active</label>
                </div>
              </div>
            </div>
          </div>

          <div class="modal__foot">
            <button class="btn btn--ghost btn--sm" (click)="close()">Cancel</button>
            <button class="btn btn--primary btn--sm" (click)="save()" [disabled]="saving">
              {{ saving() ? 'Saving...' : 'Save service' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="admin-toast" *ngIf="toast()">{{ toast() }}</div>
  `,
})
export class AdminServicesComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  readonly services = signal<Service[]>([]);
  readonly loading = signal(true);
  readonly editing = signal(false);
  readonly saving = signal(false);
  readonly toast = signal('');
  error = '';

  readonly form = this.fb.nonNullable.group({
    id: [0],
    title: ['', Validators.required],
    slug: [''],
    summary: [''],
    body: [''],
    icon: [''],
    sort_order: [0],
    highlightsText: [''],
    is_featured: [false],
    is_active: [true],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.api.adminServices().subscribe({
      next: (items) => {
        this.services.set(items);
        this.loading.set(false);
      },
      error: (err: ApiError) => {
        this.error = err.message;
        this.loading.set(false);
      },
    });
  }

  open(item?: Service): void {
    this.error = '';

    this.form.reset({
      id: 0,
      title: '',
      slug: '',
      summary: '',
      body: '',
      icon: '',
      sort_order: 0,
      highlightsText: '',
      is_featured: false,
      is_active: true,
    });

    if (item) {
      this.form.patchValue({
        id: item.id,
        title: item.title,
        slug: item.slug,
        summary: item.summary ?? '',
        body: item.body ?? '',
        icon: item.icon ?? '',
        sort_order: item.sort_order,
        highlightsText: (item.highlights ?? []).join('\n'),
        is_featured: item.is_featured,
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

    const payload: Partial<Service> = {
      id: raw.id || undefined,
      title: raw.title,
      slug: raw.slug || null,
      summary: raw.summary || null,
      body: raw.body || null,
      icon: raw.icon || null,
      sort_order: raw.sort_order,
      highlights: raw.highlightsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      is_featured: raw.is_featured,
      is_active: raw.is_active,
    } as Partial<Service>;

    if (!payload.id) {
      delete (payload as { id?: number }).id;
    }

    this.saving.set(true);
    this.error = '';

    this.api
      .adminServiceSave(payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.editing.set(false);
          this.flash('Service saved.');
          this.load();
        },
        error: (err: ApiError) => (this.error = err.firstError ?? err.message),
      });
  }

  toggle(item: Service, field: 'is_featured' | 'is_active'): void {
    this.api
      .adminServiceSave({ ...item, [field]: !item[field] })
      .subscribe({
        next: () => this.load(),
        error: (err: ApiError) => (this.error = err.message),
      });
  }

  remove(item: Service): void {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) {
      return;
    }

    this.api.adminServiceDelete(item.id).subscribe({
      next: () => {
        this.flash('Service deleted.');
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