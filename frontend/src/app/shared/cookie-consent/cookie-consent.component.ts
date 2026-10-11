import { Component, inject, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { CookieConsentService } from './cookie-consent.service';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cookie-banner" *ngIf="show()" role="dialog" aria-label="Cookie consent" aria-describedby="cookie-desc">
      <div class="cookie-banner__inner">
        <div class="cookie-banner__content">
          <div class="cookie-banner__icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div id="cookie-desc">
            <h4>We value your privacy</h4>
            <p>We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.</p>
          </div>
        </div>
        <div class="cookie-banner__actions">
          <button type="button" class="btn btn--ghost btn--sm" (click)="reject()">Reject</button>
          <button type="button" class="btn btn--primary" (click)="accept()">Accept All</button>
          <button type="button" class="btn btn--ghost btn--sm" (click)="openSettings()">Customize</button>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div class="cookie-modal-overlay" *ngIf="settingsOpen()" (click)="closeSettings()" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title">
      <div class="cookie-modal" (click)="$event.stopPropagation()">
        <div class="cookie-modal__header">
          <h3 id="cookie-modal-title">Cookie Preferences</h3>
          <button type="button" class="cookie-modal__close" (click)="closeSettings()" aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="cookie-modal__body">
          <p class="cookie-modal__desc">Manage your cookie preferences below. Essential cookies cannot be disabled as they are required for the site to function.</p>

          <div class="cookie-category">
            <div class="cookie-category__header">
              <div>
                <h4>Essential Cookies</h4>
                <p>Required for core functionality like security, network management, and accessibility.</p>
              </div>
              <label class="toggle toggle--disabled">
                <input type="checkbox" checked disabled>
                <span class="toggle__slider"></span>
              </label>
            </div>
          </div>

          <div class="cookie-category">
            <div class="cookie-category__header">
              <div>
                <h4>Analytics Cookies</h4>
                <p>Help us understand how visitors interact with our site (Google Analytics).</p>
              </div>
              <label class="toggle">
                <input type="checkbox" [(ngModel)]="analytics" (change)="saveSettings()">
                <span class="toggle__slider"></span>
              </label>
            </div>
          </div>

          <div class="cookie-category">
            <div class="cookie-category__header">
              <div>
                <h4>Marketing Cookies</h4>
                <p>Used to deliver personalized ads and measure campaign effectiveness.</p>
              </div>
              <label class="toggle">
                <input type="checkbox" [(ngModel)]="marketing" (change)="saveSettings()">
                <span class="toggle__slider"></span>
              </label>
            </div>
          </div>

          <div class="cookie-category">
            <div class="cookie-category__header">
              <div>
                <h4>Functional Cookies</h4>
                <p>Enable enhanced functionality and personalization (e.g., video players, live chat).</p>
              </div>
              <label class="toggle">
                <input type="checkbox" [(ngModel)]="functional" (change)="saveSettings()">
                <span class="toggle__slider"></span>
              </label>
            </div>
          </div>
        </div>
        <div class="cookie-modal__footer">
          <button type="button" class="btn btn--ghost" (click)="rejectAll()">Reject All</button>
          <button type="button" class="btn btn--primary" (click)="confirmSettings()">Confirm Choices</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--white);
      border-top: 1px solid var(--slate-200);
      box-shadow: 0 -4px 24px rgba(15, 23, 42, 0.1);
      animation: slideInUp 0.4s ease-out forwards;
    }

    .cookie-banner__inner {
      max-width: var(--container);
      margin: 0 auto;
      padding: 20px 24px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 24px;
      flex-wrap: wrap;
    }

    .cookie-banner__content {
      display: flex;
      gap: 16px;
      flex: 1;
      min-width: 280px;
    }

    .cookie-banner__icon {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      background: var(--blue-50);
      color: var(--blue-600);
      border-radius: var(--radius);
    }

    .cookie-banner__content h4 {
      margin: 0 0 6px;
      font-size: 1rem;
      color: var(--slate-900);
    }

    .cookie-banner__content p {
      margin: 0;
      font-size: 0.88rem;
      color: var(--slate-600);
      line-height: 1.5;
      max-width: 520px;
    }

    .cookie-banner__actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      flex-shrink: 0;
    }

    /* Modal */
    .cookie-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(11, 27, 51, 0.6);
      backdrop-filter: blur(4px);
      z-index: 1001;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      animation: fadeIn 0.2s ease-out forwards;
    }

    .cookie-modal {
      background: var(--white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      max-width: 520px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      animation: scaleIn 0.25s ease-out forwards;
    }

    .cookie-modal__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid var(--slate-200);
    }

    .cookie-modal__header h3 {
      margin: 0;
      font-size: 1.15rem;
    }

    .cookie-modal__close {
      width: 36px;
      height: 36px;
      display: grid;
      place-items: center;
      background: transparent;
      border: none;
      border-radius: var(--radius);
      color: var(--slate-500);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .cookie-modal__close:hover {
      background: var(--slate-100);
      color: var(--slate-900);
    }

    .cookie-modal__body {
      padding: 24px;
    }

    .cookie-modal__desc {
      margin: 0 0 24px;
      font-size: 0.9rem;
      color: var(--slate-600);
    }

    .cookie-category {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--slate-200);
    }

    .cookie-category:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .cookie-category__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }

    .cookie-category__header h4 {
      margin: 0 0 4px;
      font-size: 0.95rem;
      color: var(--slate-900);
    }

    .cookie-category__header p {
      margin: 0;
      font-size: 0.82rem;
      color: var(--slate-500);
    }

    .toggle {
      position: relative;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
    }

    .toggle input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle__slider {
      width: 48px;
      height: 28px;
      background: var(--slate-300);
      border-radius: 999px;
      position: relative;
      transition: background 0.2s ease;
    }

    .toggle__slider::before {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 22px;
      height: 22px;
      background: var(--white);
      border-radius: 50%;
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s ease;
    }

    .toggle input:checked + .toggle__slider {
      background: var(--blue-600);
    }

    .toggle input:checked + .toggle__slider::before {
      transform: translateX(20px);
    }

    .toggle input:focus-visible + .toggle__slider {
      outline: 2px solid var(--blue-600);
      outline-offset: 2px;
    }

    .toggle--disabled .toggle__slider {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .cookie-modal__footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 24px;
      border-top: 1px solid var(--slate-200);
      flex-wrap: wrap;
    }

    @media (max-width: 620px) {
      .cookie-banner__inner {
        flex-direction: column;
        gap: 16px;
      }

      .cookie-banner__actions {
        width: 100%;
      }

      .cookie-banner__actions .btn {
        flex: 1;
        justify-content: center;
      }
    }
  `],
})
export class CookieConsentComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly consentService = inject(CookieConsentService);
  readonly show = signal(false);
  readonly settingsOpen = signal(false);

  analytics = false;
  marketing = false;
  functional = false;

  private readonly CONSENT_KEY = 'otuyaelite_cookie_consent';
  private readonly SETTINGS_KEY = 'otuyaelite_cookie_settings';
  /**
   * Google Analytics measurement ID (format G-XXXXXXXXXX).
   * Leave empty to keep analytics cookies disabled until a real ID is configured.
   */
  private readonly GA_MEASUREMENT_ID = '';

  ngOnInit() {
    this.consentService.openSettings$.subscribe(() => this.settingsOpen.set(true));

    const consent = this.document.defaultView?.localStorage.getItem(this.CONSENT_KEY);
    if (!consent) {
      this.show.set(true);
    } else {
      const settings = JSON.parse(this.document.defaultView?.localStorage.getItem(this.SETTINGS_KEY) || '{}');
      this.analytics = settings.analytics || false;
      this.marketing = settings.marketing || false;
      this.functional = settings.functional || false;
    }
  }

  accept() {
    this.analytics = true;
    this.marketing = true;
    this.functional = true;
    this.saveConsent(true);
    this.show.set(false);
  }

  reject() {
    this.analytics = false;
    this.marketing = false;
    this.functional = false;
    this.saveConsent(false);
    this.show.set(false);
  }

  openSettings() {
    this.settingsOpen.set(true);
  }

  closeSettings() {
    this.settingsOpen.set(false);
  }

  confirmSettings() {
    this.saveConsent(true);
    this.show.set(false);
    this.closeSettings();
  }

  rejectAll() {
    this.analytics = false;
    this.marketing = false;
    this.functional = false;
    this.saveConsent(false);
    this.show.set(false);
    this.closeSettings();
  }

  saveSettings() {
    const settings = {
      analytics: this.analytics,
      marketing: this.marketing,
      functional: this.functional,
    };
    this.document.defaultView?.localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    this.applyCookies();
  }

  private saveConsent(accepted: boolean) {
    this.document.defaultView?.localStorage.setItem(this.CONSENT_KEY, accepted ? 'accepted' : 'rejected');
    this.saveSettings();
  }

  private applyCookies() {
    // Load Google Analytics only when a real measurement ID is configured.
    if (this.analytics && this.GA_MEASUREMENT_ID && typeof window !== 'undefined' && !(window as any).gaLoaded) {
      const script = this.document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_MEASUREMENT_ID}`;
      this.document.head.appendChild(script);
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function() { (window as any).dataLayer.push(arguments); };
      (window as any).gtag('js', new Date());
      (window as any).gtag('config', this.GA_MEASUREMENT_ID);
      (window as any).gaLoaded = true;
    }
  }
}