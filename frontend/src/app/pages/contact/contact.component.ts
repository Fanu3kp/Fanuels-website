import { Component, inject, computed, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ApiError, ApiService } from '../../core/api.service';
import { ContactPayload, ContactResponse, SiteSettings } from '../../core/models';
import { PageHeroComponent } from '../../shared/page-hero/page-hero.component';
import { RevealDirective } from '../../shared/reveal/reveal.directive';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

interface ProductType {
  value: string;
  label: string;
  category: string;
}

const PRODUCT_TYPES: ProductType[] = [
  { value: 'otuya-pos', label: 'Otuya POS', category: 'Retail & POS' },
  { value: 'otuya-financials', label: 'Otuya Financials', category: 'Financial Technology' },
  { value: 'otuya-ehealth-hospital-erp', label: 'Otuya e-Health Hospital ERP', category: 'Healthcare' },
  { value: 'otuya-insure', label: 'Otuya Insure', category: 'Insurance Technology' },
  { value: 'otuya-pension-management', label: 'Otuya Pension Management', category: 'Financial Technology' },
  { value: 'otuya-manufacturing-erp', label: 'Otuya Manufacturing ERP', category: 'Manufacturing' },
  { value: 'otuya-crm', label: 'Otuya CRM', category: 'Business Software' },
  { value: 'otuya-case-contract-management', label: 'Otuya Case & Contract Management', category: 'Legal Technology' },
  { value: 'otuya-academics', label: 'Otuya Academics', category: 'Education Technology' },
  { value: 'erp-implementation', label: 'ERP Implementation', category: 'Enterprise Systems' },
  { value: 'custom-software', label: 'Custom Software Development', category: 'Software & Systems' },
  { value: 'cloud-infrastructure', label: 'Cloud & Infrastructure', category: 'Software & Systems' },
  { value: 'system-integration', label: 'System Integration', category: 'Software & Systems' },
  { value: 'business-process-automation', label: 'Business Process Automation', category: 'Software & Systems' },
  { value: 'digital-transformation', label: 'Digital Transformation Consulting', category: 'Advisory' },
  { value: 'specialized-vertical-solutions', label: 'Specialized Vertical Solutions', category: 'Enterprise Systems' },
  { value: 'managed-services', label: 'IT Managed Services', category: 'Support' },
  { value: 'support-maintenance', label: 'Support & Maintenance (24/7)', category: 'Support' },
  { value: 'training-capacity-building', label: 'Training & Capacity Building', category: 'Support' },
  { value: 'other', label: 'Other / General Enquiry', category: '' },
];

export type ContactContext = 'general' | 'careers' | 'sales';

interface ContactContextConfig {
  hero: { eyebrow: string; title: string; subtitle: string; backgroundImage: string };
  submitLabel: string;
  messageLabel: string;
  messagePlaceholder: string;
  showProductType: boolean;
  showTeamSize: boolean;
  showTimeline: boolean;
  showBudget: boolean;
  showInterest: boolean;
  steps: string[];
}

const CONTACT_CONTEXTS: Record<ContactContext, ContactContextConfig> = {
  general: {
    hero: {
      eyebrow: 'Contact',
      title: "Let's build something that works",
      subtitle: 'Message us, schedule a discovery call, or ask us anything. We respond within one business day.',
      backgroundImage: '/images/backgrounds/contact-bg.svg',
    },
    submitLabel: 'Send Message',
    messageLabel: 'Project details',
    messagePlaceholder: 'Describe your project, challenges, goals, or questions. The more detail you share, the better we can help.',
    showProductType: true,
    showTeamSize: true,
    showTimeline: true,
    showBudget: false,
    showInterest: false,
    steps: [
      'We review your details and match you with the right specialist.',
      'You get a reply within one business day — honest fit assessment included.',
      "If it's a fit, we schedule a discovery call to scope your project.",
    ],
  },
  careers: {
    hero: {
      eyebrow: 'Careers',
      title: 'Get in touch',
      subtitle: "We're not hiring at the moment, but we'd love to hear about your background. Send your details and we'll keep them on file for future openings.",
      backgroundImage: '/images/backgrounds/hero-bg.svg',
    },
    submitLabel: 'Submit Application',
    messageLabel: 'About you',
    messagePlaceholder: "Tell us about yourself, your experience, and what you're passionate about. The more detail you share, the better we can match you to future roles.",
    showProductType: false,
    showTeamSize: false,
    showTimeline: false,
    showBudget: false,
    showInterest: true,
    steps: [
      'We review your background and areas of interest.',
      'Your details are kept on file for future openings.',
      "When a role matches your profile, we'll reach out directly.",
    ],
  },
  sales: {
    hero: {
      eyebrow: "Let's Talk",
      title: 'Ready to Transform Your Business?',
      subtitle: "Let's discuss how our tailored solutions can drive growth and efficiency for your organization.",
      backgroundImage: '/images/backgrounds/contact-bg.svg',
    },
    submitLabel: 'Send Message',
    messageLabel: 'Project details',
    messagePlaceholder: 'Describe your goals, challenges, or the problem you want solved. The more detail you share, the better we can help.',
    showProductType: true,
    showTeamSize: true,
    showTimeline: true,
    showBudget: true,
    showInterest: false,
    steps: [
      'We review your enquiry and match you with the right specialist.',
      'You get a reply within one business day — honest fit assessment included.',
      "If it's a fit, we schedule a discovery call to scope your project.",
    ],
  },
};

const INTEREST_AREAS = [
  'Engineering / Development',
  'Design / UX',
  'Sales & Marketing',
  'Support & Success',
  'Operations',
  'Other',
];

const BUDGET_OPTIONS = [
  'Under $5k',
  '$5k - $20k',
  '$20k - $50k',
  '$50k - $100k',
  '$100k+',
  'Not sure yet',
];

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf, PageHeroComponent, RevealDirective],
  template: `
    <app-page-hero
      [eyebrow]="cfg().hero.eyebrow"
      [title]="cfg().hero.title"
      [subtitle]="cfg().hero.subtitle"
      [backgroundImage]="cfg().hero.backgroundImage"
    />

    <section class="section">
      <div class="container contact">
        <div class="contact__form-wrap" appReveal="left">
          <div class="alert alert--success" *ngIf="success">{{ success }}</div>
          <div class="alert alert--error" *ngIf="serverError">{{ serverError }}</div>

          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="row">
              <div class="field">
                <label for="name">Full name <span class="required">*</span></label>
                <input id="name" formControlName="name" type="text" autocomplete="name" placeholder="Your name" />
                <div class="field-error" *ngIf="showError('name')">
                  {{ errorFor('name') }}
                </div>
              </div>

              <div class="field">
                <label for="email">Email address <span class="required">*</span></label>
                <input id="email" formControlName="email" type="email" autocomplete="email" placeholder="you@company.com" />
                <div class="field-error" *ngIf="showError('email')">
                  {{ errorFor('email') }}
                </div>
              </div>
            </div>

            <div class="row">
              <div class="field">
                <label for="phone">Phone <span class="hint">(optional)</span></label>
                <input id="phone" formControlName="phone" type="tel" autocomplete="tel" placeholder="+254 7xx xxx xxx" />
              </div>

              <div class="field">
                <label for="company">Company <span class="hint">(optional)</span></label>
                <input id="company" formControlName="company" type="text" autocomplete="organization" placeholder="Your organization" />
              </div>
            </div>

            <ng-container *ngIf="cfg().showProductType">
              <div class="field">
                <label for="type">I'm interested in <span class="required">*</span></label>
                <select id="type" formControlName="type" required>
                  <option value="">-- Select a product or service --</option>
                  <optgroup *ngFor="let group of groupedTypes()" [label]="group.category">
                    <option *ngFor="let item of group.items" [value]="item.value">{{ item.label }}</option>
                  </optgroup>
                </select>
                <div class="field-error" *ngIf="showError('type')">
                  {{ errorFor('type') }}
                </div>
              </div>
            </ng-container>

            <div class="row" *ngIf="cfg().showInterest">
              <div class="field">
                <label for="interest">Area of interest <span class="required">*</span></label>
                <select id="interest" formControlName="interest">
                  <option value="">-- Select an area --</option>
                  <option *ngFor="let area of interestAreas" [value]="area">{{ area }}</option>
                </select>
                <div class="field-error" *ngIf="showError('interest')">
                  {{ errorFor('interest') }}
                </div>
              </div>

              <div class="field">
                <label for="linkedin">LinkedIn / portfolio <span class="hint">(optional)</span></label>
                <input id="linkedin" formControlName="linkedin" type="url" autocomplete="url" placeholder="https://linkedin.com/in/…" />
              </div>
            </div>

            <div class="row" *ngIf="cfg().showTeamSize || cfg().showBudget || cfg().showTimeline">
              <div class="field" *ngIf="cfg().showTeamSize">
                <label for="teamSize">Team size / Users <span class="hint">(optional)</span></label>
                <input
                  id="teamSize"
                  formControlName="teamSize"
                  type="number"
                  min="1"
                  max="10000"
                  placeholder="e.g. 50"
                />
                <div class="field-error" *ngIf="showError('teamSize')">
                  Enter a number (1–10,000).
                </div>
              </div>

              <div class="field" *ngIf="cfg().showBudget">
                <label for="budget">Budget <span class="hint">(optional)</span></label>
                <select id="budget" formControlName="budget">
                  <option value="">-- Select a range --</option>
                  <option *ngFor="let option of budgetOptions" [value]="option">{{ option }}</option>
                </select>
              </div>

              <div class="field" *ngIf="cfg().showTimeline">
                <label for="timeline">Timeline</label>
                <select id="timeline" formControlName="timeline">
                  <option value="">-- When do you need this? --</option>
                  <option value="asap">ASAP</option>
                  <option value="1-2-weeks">1-2 weeks</option>
                  <option value="2-4-weeks">2-4 weeks</option>
                  <option value="1-3">1-3 months</option>
                  <option value="3-6">3-6 months</option>
                  <option value="6-12">6-12 months</option>
                  <option value="exploring">Just exploring</option>
                </select>
              </div>
            </div>

            <div class="field">
              <label for="message">{{ cfg().messageLabel }} <span class="required">*</span></label>
              <textarea
                id="message"
                formControlName="message"
                rows="6"
                [placeholder]="cfg().messagePlaceholder"
              ></textarea>
              <div class="field-error" *ngIf="showError('message')">
                {{ errorFor('message') }}
              </div>
            </div>

            <!-- Honeypot -->
            <input type="text" formControlName="website" class="trap" tabindex="-1" autocomplete="off" />

            <button type="submit" class="btn btn--sky btn--full" [disabled]="sending">
              {{ sending ? 'Sending...' : cfg().submitLabel }}
            </button>
          </form>
        </div>

        <aside class="contact__side" appReveal="right" [appRevealDelay]="110">
          <div class="card">
            <h3>Contact Information</h3>
            <ul class="details">
              <li *ngIf="settings()?.['contact_email']">
                <strong>Email</strong>
                <a [href]="'mailto:' + settings()?.['contact_email']">{{ settings()?.['contact_email'] }}</a>
              </li>
              <li *ngIf="settings()?.['contact_phone']">
                <strong>Phone</strong>
                <span>{{ settings()?.['contact_phone'] }}</span>
              </li>
              <li *ngIf="settings()?.['contact_address']">
                <strong>Address</strong>
                <span>{{ settings()?.['contact_address'] }}</span>
              </li>
              <li *ngIf="settings()?.['office_hours']">
                <strong>Office hours</strong>
                <span>{{ settings()?.['office_hours'] }}</span>
              </li>
            </ul>
          </div>

          <div class="card">
            <h3>What happens next?</h3>
            <ol class="steps">
              <li *ngFor="let step of cfg().steps; let i = index" [attr.data-step]="i + 1">{{ step }}</li>
            </ol>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: [
    `
      .contact { display: grid; grid-template-columns: 1.5fr 1fr; gap: 50px; align-items: start; }
      .contact__form-wrap {
        background: var(--white);
        border: 1px solid var(--slate-200);
        border-radius: var(--radius-lg);
        padding: 34px;
        box-shadow: 0 10px 25px rgba(11, 27, 51, 0.06), 0 4px 12px rgba(11, 27, 51, 0.04);
        position: sticky;
        top: 30px;
      }
      .row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
      .trap { position: absolute; left: -9999px; opacity: 0; height: 0; }
      .required { color: var(--rose-500); margin-left: 2px; }

      .field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .field label { font-size: 1rem; font-weight: 600; color: var(--slate-800); display: flex; align-items: center; gap: 4px; }
      .field input, .field select, .field textarea {
        padding: 12px 16px;
        font-size: 0.95rem;
        border: 1.5px solid var(--slate-400);
        border-radius: var(--radius-md);
        background: var(--white);
        color: var(--navy-900);
        transition: all 0.2s ease;
      }
      .field input:focus, .field select:focus, .field textarea:focus {
        border-color: var(--sky-500);
        background: var(--white);
        box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
        outline: none;
      }
      .field input::placeholder, .field select::placeholder, .field textarea::placeholder { color: var(--slate-400); }
      .field-error { color: var(--rose-600); font-size: 0.8rem; margin-top: 2px; display: flex; align-items: center; gap: 4px; }
      .hint { color: var(--slate-500); font-weight: 400; }

      .contact__side { display: flex; flex-direction: column; gap: 20px; }
      .card {
        background: var(--white);
        border: 1px solid var(--slate-200);
        border-radius: var(--radius-lg);
        padding: 24px;
        box-shadow: 0 4px 12px rgba(11, 27, 51, 0.04);
      }
      .card h3 {
        margin: 0 0 16px;
        color: var(--navy-900);
        font-size: 1.15rem;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .card h3::before {
        content: '';
        width: 32px;
        height: 2px;
        background: linear-gradient(90deg, var(--teal-400), var(--pink-500));
        border-radius: 2px;
      }
      .details { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
      .details strong { display: block; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--slate-500); margin-bottom: 3px; }
      .details span, .details a { font-size: 0.94rem; word-break: break-word; color: var(--slate-600); }
      .details a {
        color: var(--teal-500);
        text-decoration: none;
        transition: color 0.2s ease;
      }
      .details a:hover { color: var(--teal-600); text-decoration: underline; }
      .steps { margin: 0; padding-left: 0; display: flex; flex-direction: column; gap: 14px; font-size: 0.93rem; color: var(--slate-600); }
      .steps li {
        list-style: none;
        position: relative;
        padding-left: 32px;
      }
      .steps li::before {
        content: attr(data-step);
        position: absolute;
        left: 0;
        top: 0;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--teal-400), var(--pink-500));
        color: var(--white);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.72rem;
        font-weight: 700;
      }

      .alert {
        padding: 14px 18px;
        border-radius: var(--radius-md);
        font-size: 0.92rem;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .alert--success {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #065f46;
      }
      .alert--error {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #991b2b;
      }

      .btn--full { width: 100%; }

      @media (max-width: 900px) {
        .contact { grid-template-columns: 1fr; gap: 28px; }
        .row { grid-template-columns: 1fr; }
        .contact__form-wrap {
          position: static;
          top: auto;
          padding: 22px;
        }
        .card { padding: 20px; }
      }
    `,
  ],
})
export class ContactComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  readonly settings = toSignal(this.api.settings().pipe(catchError(() => of({} as SiteSettings))), {
    initialValue: null,
  });

  sending = false;
  success = '';
  serverError = '';
  private fieldErrors: Record<string, string[]> = {};

  readonly groupedTypes = computed(() => {
    const grouped: Record<string, ProductType[]> = {};
    for (const type of PRODUCT_TYPES) {
      if (!grouped[type.category]) grouped[type.category] = [];
      grouped[type.category].push(type);
    }
    return Object.entries(grouped).map(([category, items]) => ({ category, items }));
  });

  readonly context = signal<ContactContext>('general');
  readonly cfg = computed(() => CONTACT_CONTEXTS[this.context()]);
  readonly interestAreas = INTEREST_AREAS;
  readonly budgetOptions = BUDGET_OPTIONS;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    company: [''],
    type: ['', Validators.required],
    interest: [''],
    linkedin: ['', Validators.maxLength(255)],
    budget: ['', Validators.maxLength(50)],
    teamSize: [null, [Validators.min(1), Validators.max(10000)]],
    timeline: [''],
    message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(5000)]],
    website: [''],
  });

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const raw = params.get('context');
      const ctx: ContactContext = raw === 'careers' || raw === 'sales' ? raw : 'general';
      this.context.set(ctx);

      if (ctx === 'careers') {
        this.form.controls.type.setValue('career-application');
      } else if (this.form.controls.type.value === 'career-application') {
        this.form.controls.type.setValue('');
      }

      const interest = this.form.controls.interest;
      if (ctx === 'careers') {
        interest.setValidators([Validators.required]);
      } else {
        interest.clearValidators();
      }
      interest.updateValueAndValidity();

      const type = params.get('type');
      if (type && ctx !== 'careers' && !this.form.controls.type.value) {
        this.form.controls.type.setValue(type);
      }
    });
  }

  showError(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  errorFor(field: string): string {
    const server = this.fieldErrors[field]?.[0];
    if (server) {
      return server;
    }

    const control = this.form.get(field);
    if (!control) return '';

    if (control.hasError('required')) return 'This field is required.';
    if (control.hasError('email')) return 'Enter a valid email address.';
    if (control.hasError('minlength')) return `Please use at least ${control.getError('minlength').requiredLength} characters.`;
    if (control.hasError('min')) return `Must be at least ${control.getError('min').min}.`;
    if (control.hasError('max')) return `Must be no more than ${control.getError('max').max}.`;

    return 'Please check this field.';
  }

  submit(): void {
    this.success = '';
    this.serverError = '';
    this.fieldErrors = {};

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.sending = true;

    const payload: ContactPayload = { ...this.form.getRawValue() };

    if (this.context() === 'careers') {
      payload.type = 'career-application';
      payload.subject = this.form.value.interest;
      payload.dynamicData = {
        area_of_interest: this.form.value.interest,
        linkedin_url: this.form.value.linkedin || null,
      };
    }

    if (this.context() === 'sales') {
      payload.budget = this.form.value.budget || null;
    }

    this.api
      .sendContact(payload)
      .pipe(finalize(() => this.sending = false))
      .subscribe({
        next: (res) => {
          this.success = res.message + (res.reference ? ` Reference: ${res.reference}.` : '');
          this.form.reset();
        },
        error: (error: ApiError) => {
          this.fieldErrors = error.errors ?? {};
          if (error.status === 0) {
            // Network-level failure (API unreachable or blocked by CORS).
            const email = this.settings()?.['contact_email'];
            this.serverError = email
              ? `We couldn't reach our server just now. Please try again in a moment — or email us directly at ${email}.`
              : 'We couldn\'t reach our server just now. Please try again in a moment.';
          } else {
            this.serverError = this.fieldErrors['name']?.[0] ?? error.firstError ?? error.message;
          }
          this.sending = false;
        },
      });
  }
}