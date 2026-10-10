import { Component, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ApiError, ApiService } from '../../core/api.service';
import { SiteSettings } from '../../core/models';
import { RevealDirective } from '../../shared/reveal/reveal.directive';

interface SettingField {
  key: string;
  label: string;
  hint?: string;
  multiline?: boolean;
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RevealDirective],
  template: `
    <div class="admin-head" appReveal="up">
      <div>
        <h1>Settings</h1>
        <p>Company details shown in the header, footer and contact page.</p>
      </div>
      <div class="admin-actions">
        <button class="btn btn--primary btn--sm" (click)="save()" [disabled]="saving()">
          {{ saving() ? 'Saving...' : 'Save changes' }}
        </button>
      </div>
    </div>

    <div class="alert alert--success" *ngIf="success">{{ success }}</div>
    <div class="alert alert--error" *ngIf="error">{{ error }}</div>

    <div class="admin-card" appReveal="up" [appRevealDelay]="120">
      <div class="modal__body">
        <div class="field" *ngFor="let field of fields">
          <label [attr.for]="'set-' + field.key">{{ field.label }}</label>
          <textarea
            *ngIf="field.multiline; else singleLine"
            [id]="'set-' + field.key"
            [ngModel]="value(field.key)"
            (ngModelChange)="setValue(field.key, $event)"
            rows="4"
          ></textarea>
          <ng-template #singleLine>
            <input
              [id]="'set-' + field.key"
              type="text"
              [ngModel]="value(field.key)"
              (ngModelChange)="setValue(field.key, $event)"
            />
          </ng-template>
          <div class="hint" style="font-size:0.78rem;color:var(--slate-500)" *ngIf="field.hint">{{ field.hint }}</div>
        </div>
      </div>
      <div class="modal__foot">
        <button class="btn btn--primary btn--sm" (click)="save()" [disabled]="saving()">
          {{ saving() ? 'Saving...' : 'Save changes' }}
        </button>
      </div>
    </div>
  `,
})
export class AdminSettingsComponent {
  private readonly api = inject(ApiService);

  readonly fields: SettingField[] = [
    { key: 'company_name', label: 'Company name' },
    { key: 'tagline', label: 'Tagline', hint: 'Short line shown under the logo and in the hero.' },
    { key: 'about_heading', label: 'Home page heading', multiline: true },
    { key: 'about_body', label: 'About text', multiline: true, hint: 'Separate paragraphs with a blank line.' },
    { key: 'solutions_heading', label: 'Core solutions heading' },
    { key: 'solutions_intro', label: 'Core solutions intro', multiline: true },
    { key: 'process_heading', label: 'Engagement process heading' },
    { key: 'process_intro', label: 'Engagement process intro', multiline: true },
    { key: 'contact_email', label: 'Contact email', hint: 'Enquiry notifications are sent here.' },
    { key: 'contact_phone', label: 'Contact phone' },
    { key: 'contact_address', label: 'Address', multiline: true },
    { key: 'office_hours', label: 'Office hours' },
    { key: 'social_facebook', label: 'Facebook URL' },
    { key: 'social_linkedin', label: 'LinkedIn URL' },
    { key: 'social_instagram', label: 'Instagram URL' },
    { key: 'social_tiktok', label: 'TikTok URL' },
    { key: 'social_youtube', label: 'YouTube URL' },
  ];

  readonly draft = signal<SiteSettings>({});
  readonly saving = signal(false);
  readonly loaded = signal(false);
  success = '';
  error = '';

  constructor() {
    this.api.adminSettings().subscribe({
      next: (items) => {
        this.draft.set({ ...items });
        this.loaded.set(true);
      },
      error: (err: ApiError) => (this.error = err.message),
    });
  }

  value(key: string): string {
    return this.draft()[key] ?? '';
  }

  setValue(key: string, value: string): void {
    this.draft.set({ ...this.draft(), [key]: value });
  }

  save(): void {
    this.success = '';
    this.error = '';
    this.saving.set(true);

    const values = this.fields.map((field) => ({ key: field.key, value: this.value(field.key) }));

    this.api
      .adminSettingsBulk(values)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (items) => {
          this.draft.set({ ...items });
          this.success = 'Settings saved.';
        },
        error: (err: ApiError) => (this.error = err.firstError ?? err.message),
      });
  }
}