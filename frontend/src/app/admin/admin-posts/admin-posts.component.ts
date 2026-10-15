import { Component, inject, signal } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ApiError, ApiService } from '../../core/api.service';
import { Category, Post } from '../../core/models';
import { RevealDirective } from '../../shared/reveal/reveal.directive';

@Component({
  selector: 'app-admin-posts',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, ReactiveFormsModule, RevealDirective],
  template: `
    <div class="admin-head" appReveal="up">
      <div>
        <h1>Blog posts</h1>
        <p>Articles published under Insights.</p>
      </div>
      <div class="admin-actions">
        <button class="btn btn--primary btn--sm" (click)="open()">Add post</button>
      </div>
    </div>

    <div class="alert alert--error" *ngIf="error">{{ error }}</div>

    <div class="admin-card" appReveal="up" [appRevealDelay]="120">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Published</th>
            <th>Views</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of posts()">
            <td>
              <strong>{{ item.title }}</strong>
              <div style="font-size:0.84rem;color:var(--slate-500)">
                {{ item.published_at ? (item.published_at | date: 'd M y') : 'Not scheduled' }}
              </div>
            </td>
            <td>{{ item.category?.name || '--' }}</td>
            <td>
              <button class="toggle" [class.toggle--on]="item.is_published" (click)="toggle(item)"
                [attr.aria-label]="'Toggle published for ' + item.title"></button>
            </td>
            <td>{{ item.views }}</td>
            <td>
              <div class="admin-table__actions">
                <button class="btn btn--ghost btn--sm" (click)="open(item)">Edit</button>
                <button class="btn btn--ghost btn--sm" (click)="remove(item)">Delete</button>
              </div>
            </td>
          </tr>
          <tr *ngIf="!posts().length && !loading()">
            <td colspan="5" style="text-align:center;color:var(--slate-500);padding:44px">No posts yet.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal-backdrop" *ngIf="editing()" (click)="close()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal__head">
          <h2>{{ form.get('id')?.value ? 'Edit post' : 'Add post' }}</h2>
          <button class="modal__close" (click)="close()" aria-label="Close">&times;</button>
        </div>

        <form [formGroup]="form">
          <div class="modal__body">
            <div class="form-grid">
              <div class="field full">
                <label>Title</label>
                <input formControlName="title" />
              </div>
              <div class="field">
                <label>Category</label>
                <select formControlName="category_id">
                  <option [ngValue]="0">None</option>
                  <option *ngFor="let category of categories()" [ngValue]="category.id">{{ category.name }}</option>
                </select>
              </div>
              <div class="field">
                <label>Slug</label>
                <input formControlName="slug" />
              </div>
              <div class="field full">
                <label>Excerpt</label>
                <textarea formControlName="excerpt" rows="2"></textarea>
              </div>
              <div class="field full">
                <label>Body</label>
                <textarea formControlName="body" rows="12" placeholder="Separate paragraphs with a blank line"></textarea>
              </div>
              <div class="field">
                <div class="checkbox">
                  <input id="post-published" type="checkbox" formControlName="is_published" />
                  <label for="post-published">Published</label>
                </div>
              </div>
              <div class="field">
                <label>Publish date <span class="hint">(optional)</span></label>
                <input formControlName="published_at" type="date" />
              </div>
            </div>
          </div>

          <div class="modal__foot">
            <button class="btn btn--ghost btn--sm" (click)="close()">Cancel</button>
            <button class="btn btn--primary btn--sm" (click)="save()" [disabled]="saving()">
              {{ saving() ? 'Saving...' : 'Save post' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="admin-toast" *ngIf="toast()">{{ toast() }}</div>
  `,
})
export class AdminPostsComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  readonly posts = signal<Post[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly editing = signal(false);
  readonly saving = signal(false);
  readonly toast = signal('');
  error = '';

  readonly form = this.fb.nonNullable.group({
    id: [0],
    title: ['', Validators.required],
    slug: [''],
    category_id: [0],
    excerpt: [''],
    body: ['', Validators.required],
    is_published: [false],
    published_at: [''],
  });

  constructor() {
    this.load();
    this.api.adminCategories().subscribe({
      next: (items) => this.categories.set(items),
      error: () => this.categories.set([]),
    });
  }

  load(): void {
    this.api.adminPosts().subscribe({
      next: (items) => {
        this.posts.set(items);
        this.loading.set(false);
      },
      error: (err: ApiError) => {
        this.error = err.message;
        this.loading.set(false);
      },
    });
  }

  open(item?: Post): void {
    this.error = '';
    this.form.reset({
      id: 0,
      title: '',
      slug: '',
      category_id: 0,
      excerpt: '',
      body: '',
      is_published: false,
      published_at: '',
    });

    if (item) {
      this.form.patchValue({
        id: item.id,
        title: item.title,
        slug: item.slug,
        category_id: item.category?.id ?? 0,
        excerpt: item.excerpt ?? '',
        body: item.body,
        is_published: item.is_published,
        published_at: item.published_at ? item.published_at.substring(0, 10) : '',
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

    const payload: Partial<Post> & { category_id?: number | null } = {
      title: raw.title,
      slug: raw.slug || undefined,
      category_id: raw.category_id || null,
      excerpt: raw.excerpt || null,
      body: raw.body,
      is_published: raw.is_published,
      published_at: raw.published_at ? `${raw.published_at} 09:00:00` : null,
    };

    if (raw.id) {
      payload.id = raw.id;
    }

    this.saving.set(true);
    this.error = '';

    this.api
      .adminPostSave(payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.editing.set(false);
          this.flash('Post saved.');
          this.load();
        },
        error: (err: ApiError) => (this.error = err.firstError ?? err.message),
      });
  }

  toggle(item: Post): void {
    this.api
      .adminPostSave({ ...item, is_published: !item.is_published })
      .subscribe({
        next: () => this.load(),
        error: (err: ApiError) => (this.error = err.message),
      });
  }

  remove(item: Post): void {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) {
      return;
    }

    this.api.adminPostDelete(item.id).subscribe({
      next: () => {
        this.flash('Post deleted.');
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