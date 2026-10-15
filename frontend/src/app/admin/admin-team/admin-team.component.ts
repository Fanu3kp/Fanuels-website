import { Component, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ApiError, ApiService } from '../../core/api.service';
import { TeamMember } from '../../core/models';
import { RevealDirective } from '../../shared/reveal/reveal.directive';

@Component({
  selector: 'app-admin-team',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, RevealDirective],
  template: `
    <div class="admin-head" appReveal="up">
      <div>
        <h1>Team</h1>
        <p>People shown on the About page.</p>
      </div>
      <div class="admin-actions">
        <button class="btn btn--primary btn--sm" (click)="open()">Add member</button>
      </div>
    </div>

    <div class="alert alert--error" *ngIf="error">{{ error }}</div>

    <div class="admin-card" appReveal="up" [appRevealDelay]="120">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Order</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of members()">
            <td>
              <strong>{{ item.name }}</strong>
              <div style="font-size:0.84rem;color:var(--slate-500)">{{ item.email || '--' }}</div>
            </td>
            <td>{{ item.role }}</td>
            <td>{{ item.sort_order }}</td>
            <td>
              <button class="toggle" [class.toggle--on]="item.is_active" (click)="toggle(item)"
                [attr.aria-label]="'Toggle active for ' + item.name"></button>
            </td>
            <td>
              <div class="admin-table__actions">
                <button class="btn btn--ghost btn--sm" (click)="open(item)">Edit</button>
                <button class="btn btn--ghost btn--sm" (click)="remove(item)">Delete</button>
              </div>
            </td>
          </tr>
          <tr *ngIf="!members().length && !loading()">
            <td colspan="5" style="text-align:center;color:var(--slate-500);padding:44px">No team members yet.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal-backdrop" *ngIf="editing()" (click)="close()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal__head">
          <h2>{{ form.get('id')?.value ? 'Edit team member' : 'Add team member' }}</h2>
          <button class="modal__close" (click)="close()" aria-label="Close">&times;</button>
        </div>

        <form [formGroup]="form">
          <div class="modal__body">
            <div class="form-grid">
              <div class="field">
                <label>Name</label>
                <input formControlName="name" />
              </div>
              <div class="field">
                <label>Role</label>
                <input formControlName="role" />
              </div>
              <div class="field">
                <label>Email</label>
                <input formControlName="email" type="email" />
              </div>
              <div class="field">
                <label>Sort order</label>
                <input formControlName="sort_order" type="number" min="0" />
              </div>
              <div class="field full">
                <label>Bio</label>
                <textarea formControlName="bio" rows="4"></textarea>
              </div>
              <div class="field">
                <label>LinkedIn URL</label>
                <input formControlName="linkedin_url" />
              </div>
              <div class="field">
                <label>X (Twitter) URL</label>
                <input formControlName="x_url" />
              </div>
              <div class="field">
                <div class="checkbox">
                  <input id="team-active" type="checkbox" formControlName="is_active" />
                  <label for="team-active">Active</label>
                </div>
              </div>
            </div>
          </div>

          <div class="modal__foot">
            <button class="btn btn--ghost btn--sm" (click)="close()">Cancel</button>
            <button class="btn btn--primary btn--sm" (click)="save()" [disabled]="saving()">
              {{ saving() ? 'Saving...' : 'Save member' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="admin-toast" *ngIf="toast()">{{ toast() }}</div>
  `,
})
export class AdminTeamComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  readonly members = signal<TeamMember[]>([]);
  readonly loading = signal(true);
  readonly editing = signal(false);
  readonly saving = signal(false);
  readonly toast = signal('');
  error = '';

  readonly form = this.fb.nonNullable.group({
    id: [0],
    name: ['', Validators.required],
    role: ['', Validators.required],
    bio: [''],
    email: [''],
    linkedin_url: [''],
    x_url: [''],
    sort_order: [0],
    is_active: [true],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.api.adminTeam().subscribe({
      next: (items) => {
        this.members.set(items);
        this.loading.set(false);
      },
      error: (err: ApiError) => {
        this.error = err.message;
        this.loading.set(false);
      },
    });
  }

  open(item?: TeamMember): void {
    this.error = '';
    this.form.reset({
      id: 0,
      name: '',
      role: '',
      bio: '',
      email: '',
      linkedin_url: '',
      x_url: '',
      sort_order: this.members().length + 1,
      is_active: true,
    });

    if (item) {
      this.form.patchValue({
        id: item.id,
        name: item.name,
        role: item.role,
        bio: item.bio ?? '',
        email: item.email ?? '',
        linkedin_url: item.linkedin_url ?? '',
        x_url: item.x_url ?? '',
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

    const payload: Partial<TeamMember> = {
      name: raw.name,
      role: raw.role,
      bio: raw.bio || null,
      email: raw.email || null,
      linkedin_url: raw.linkedin_url || null,
      x_url: raw.x_url || null,
      sort_order: raw.sort_order,
      is_active: raw.is_active,
    };

    if (raw.id) {
      payload.id = raw.id;
    }

    this.saving.set(true);
    this.error = '';

    this.api
      .adminTeamSave(payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.editing.set(false);
          this.flash('Team member saved.');
          this.load();
        },
        error: (err: ApiError) => (this.error = err.firstError ?? err.message),
      });
  }

  toggle(item: TeamMember): void {
    this.api.adminTeamSave({ ...item, is_active: !item.is_active }).subscribe({
      next: () => this.load(),
      error: (err: ApiError) => (this.error = err.message),
    });
  }

  remove(item: TeamMember): void {
    if (!confirm(`Remove "${item.name}" from the team?`)) {
      return;
    }

    this.api.adminTeamDelete(item.id).subscribe({
      next: () => {
        this.flash('Team member removed.');
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