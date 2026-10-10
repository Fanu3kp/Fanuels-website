import { Component, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ApiError, ApiService } from '../../core/api.service';
import { Category } from '../../core/models';
import { RevealDirective } from '../../shared/reveal/reveal.directive';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, RevealDirective],
  template: `
    <div class="admin-head" appReveal="up">
      <div>
        <h1>Categories</h1>
        <p>Categories used to organise blog posts.</p>
      </div>
      <div class="admin-actions">
        <button class="btn btn--primary btn--sm" (click)="open()">Add category</button>
      </div>
    </div>

    <div class="alert alert--error" *ngIf="error">{{ error }}</div>

    <div class="admin-card" appReveal="up" [appRevealDelay]="120">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of categories()">
            <td>
              <strong>{{ item.name }}</strong>
              <div style="font-size:0.84rem;color:var(--slate-500)">{{ item.description }}</div>
            </td>
            <td>/{{ item.slug }}</td>
            <td>
              <div class="admin-table__actions">
                <button class="btn btn--ghost btn--sm" (click)="open(item)">Edit</button>
                <button class="btn btn--ghost btn--sm" (click)="remove(item)">Delete</button>
              </div>
            </td>
          </tr>
          <tr *ngIf="!categories().length && !loading()">
            <td colspan="3" style="text-align:center;color:var(--slate-500);padding:44px">No categories yet.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal-backdrop" *ngIf="editing()" (click)="close()">
      <div class="modal" style="max-width:520px" (click)="$event.stopPropagation()">
        <div class="modal__head">
          <h2>{{ form.get('id')?.value ? 'Edit category' : 'Add category' }}</h2>
          <button class="modal__close" (click)="close()" aria-label="Close">&times;</button>
        </div>

        <form [formGroup]="form">
          <div class="modal__body">
            <div class="field">
              <label>Name</label>
              <input formControlName="name" />
            </div>
            <div class="field">
              <label>Slug</label>
              <input formControlName="slug" />
            </div>
            <div class="field">
              <label>Description</label>
              <textarea formControlName="description" rows="3"></textarea>
            </div>
          </div>

          <div class="modal__foot">
            <button class="btn btn--ghost btn--sm" (click)="close()">Cancel</button>
            <button class="btn btn--primary btn--sm" (click)="save()" [disabled]="saving()">
              {{ saving() ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="admin-toast" *ngIf="toast()">{{ toast() }}</div>
  `,
})
export class AdminCategoriesComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly editing = signal(false);
  readonly saving = signal(false);
  readonly toast = signal('');
  error = '';

  readonly form = this.fb.nonNullable.group({
    id: [0],
    name: ['', Validators.required],
    slug: [''],
    description: [''],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.api.adminCategories().subscribe({
      next: (items) => {
        this.categories.set(items);
        this.loading.set(false);
      },
      error: (err: ApiError) => {
        this.error = err.message;
        this.loading.set(false);
      },
    });
  }

  open(item?: Category): void {
    this.error = '';
    this.form.reset({ id: 0, name: '', slug: '', description: '' });

    if (item) {
      this.form.patchValue({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description ?? '',
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

    const payload: Partial<Category> = {
      name: raw.name,
      slug: raw.slug || undefined,
      description: raw.description || null,
    };

    if (raw.id) {
      payload.id = raw.id;
    }

    this.saving.set(true);
    this.error = '';

    this.api
      .adminCategorySave(payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.editing.set(false);
          this.flash('Category saved.');
          this.load();
        },
        error: (err: ApiError) => (this.error = err.firstError ?? err.message),
      });
  }

  remove(item: Category): void {
    if (!confirm(`Delete "${item.name}"? Posts in this category will be uncategorised.`)) {
      return;
    }

    this.api.adminCategoryDelete(item.id).subscribe({
      next: () => {
        this.flash('Category deleted.');
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