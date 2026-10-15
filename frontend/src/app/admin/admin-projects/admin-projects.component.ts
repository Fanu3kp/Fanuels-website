import { Component, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ApiError, ApiService } from '../../core/api.service';
import { Project } from '../../core/models';
import { RevealDirective } from '../../shared/reveal/reveal.directive';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, RevealDirective],
  template: `
    <div class="admin-head" appReveal="up">
      <div>
        <h1>Projects</h1>
        <p>Case studies shown on the public projects pages.</p>
      </div>
      <div class="admin-actions">
        <button class="btn btn--primary btn--sm" (click)="open()">Add project</button>
      </div>
    </div>

    <div class="alert alert--error" *ngIf="error">{{ error }}</div>

    <div class="admin-card" appReveal="up" [appRevealDelay]="120">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Client</th>
            <th>Published</th>
            <th>Featured</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of projects()">
            <td>
              <strong>{{ item.title }}</strong>
              <div style="font-size:0.84rem;color:var(--slate-500)">/{{ item.slug }}</div>
            </td>
            <td>{{ item.client || '--' }}</td>
            <td>
              <button class="toggle" [class.toggle--on]="item.is_published" (click)="toggle(item, 'is_published')"
                [attr.aria-label]="'Toggle published for ' + item.title"></button>
            </td>
            <td>
              <button class="toggle" [class.toggle--on]="item.is_featured" (click)="toggle(item, 'is_featured')"
                [attr.aria-label]="'Toggle featured for ' + item.title"></button>
            </td>
            <td>
              <div class="admin-table__actions">
                <button class="btn btn--ghost btn--sm" (click)="open(item)">Edit</button>
                <button class="btn btn--ghost btn--sm" (click)="remove(item)">Delete</button>
              </div>
            </td>
          </tr>
          <tr *ngIf="!projects().length && !loading()">
            <td colspan="5" style="text-align:center;color:var(--slate-500);padding:44px">No projects yet.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal-backdrop" *ngIf="editing()" (click)="close()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal__head">
          <h2>{{ form.get('id')?.value ? 'Edit project' : 'Add project' }}</h2>
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
                <label>Client</label>
                <input formControlName="client" />
              </div>
              <div class="field">
                <label>Slug</label>
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
              <div class="field full">
                <label>Technologies <span class="hint">(one per line)</span></label>
                <textarea formControlName="technologiesText" rows="4"></textarea>
              </div>
              <div class="field">
                <label>Completed at</label>
                <input formControlName="completed_at" type="date" />
              </div>
              <div class="field">
                <label>Sort order</label>
                <input formControlName="sort_order" type="number" min="0" />
              </div>
              <div class="field full">
                <label>Project URL</label>
                <input formControlName="project_url" placeholder="https://" />
              </div>
              <div class="field">
                <div class="checkbox">
                  <input id="prj-published" type="checkbox" formControlName="is_published" />
                  <label for="prj-published">Published</label>
                </div>
              </div>
              <div class="field">
                <div class="checkbox">
                  <input id="prj-featured" type="checkbox" formControlName="is_featured" />
                  <label for="prj-featured">Featured</label>
                </div>
              </div>
            </div>
          </div>

          <div class="modal__foot">
            <button class="btn btn--ghost btn--sm" (click)="close()">Cancel</button>
            <button class="btn btn--primary btn--sm" (click)="save()" [disabled]="saving()">
              {{ saving() ? 'Saving...' : 'Save project' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="admin-toast" *ngIf="toast()">{{ toast() }}</div>
  `,
})
export class AdminProjectsComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  readonly projects = signal<Project[]>([]);
  readonly loading = signal(true);
  readonly editing = signal(false);
  readonly saving = signal(false);
  readonly toast = signal('');
  error = '';

  readonly form = this.fb.nonNullable.group({
    id: [0],
    title: ['', Validators.required],
    slug: [''],
    client: [''],
    summary: ['', Validators.required],
    body: [''],
    technologiesText: [''],
    project_url: [''],
    completed_at: [''],
    sort_order: [0],
    is_published: [false],
    is_featured: [false],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.api.adminProjects().subscribe({
      next: (items) => {
        this.projects.set(items);
        this.loading.set(false);
      },
      error: (err: ApiError) => {
        this.error = err.message;
        this.loading.set(false);
      },
    });
  }

  open(item?: Project): void {
    this.error = '';
    this.form.reset({
      id: 0,
      title: '',
      slug: '',
      client: '',
      summary: '',
      body: '',
      technologiesText: '',
      project_url: '',
      completed_at: '',
      sort_order: 0,
      is_published: false,
      is_featured: false,
    });

    if (item) {
      this.form.patchValue({
        id: item.id,
        title: item.title,
        slug: item.slug,
        client: item.client ?? '',
        summary: item.summary ?? '',
        body: item.body ?? '',
        technologiesText: (item.technologies ?? []).join('\n'),
        project_url: item.project_url ?? '',
        completed_at: item.completed_at ? item.completed_at.substring(0, 10) : '',
        sort_order: 0,
        is_published: item.is_published,
        is_featured: item.is_featured,
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

    const payload: Partial<Project> & { sort_order?: number } = {
      title: raw.title,
      slug: raw.slug || undefined,
      client: raw.client || null,
      summary: raw.summary,
      body: raw.body || null,
      technologies: raw.technologiesText.split('\n').map((l) => l.trim()).filter(Boolean),
      project_url: raw.project_url || null,
      completed_at: raw.completed_at || null,
      sort_order: raw.sort_order,
      is_published: raw.is_published,
      is_featured: raw.is_featured,
    };

    if (raw.id) {
      payload.id = raw.id;
    }

    this.saving.set(true);
    this.error = '';

    this.api
      .adminProjectSave(payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.editing.set(false);
          this.flash('Project saved.');
          this.load();
        },
        error: (err: ApiError) => (this.error = err.firstError ?? err.message),
      });
  }

  toggle(item: Project, field: 'is_published' | 'is_featured'): void {
    this.api.adminProjectSave({ ...item, [field]: !item[field] }).subscribe({
      next: () => this.load(),
      error: (err: ApiError) => (this.error = err.message),
    });
  }

  remove(item: Project): void {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) {
      return;
    }

    this.api.adminProjectDelete(item.id).subscribe({
      next: () => {
        this.flash('Project deleted.');
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