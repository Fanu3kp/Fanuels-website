import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/api.service';
import { APP_CONFIG } from '../../../environments/app-config.model';
import { CookieConsentService } from '../../shared/cookie-consent/cookie-consent.service';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [RouterLink, DatePipe, NgIf, NgFor],
  template: `
    <footer class="footer">
      <div class="container">
<div class="footer__grid">
          <div>
            <div class="footer__brand">
              <span class="footer__mark">OG</span>
              <strong>{{ config.siteName }}</strong>
            </div>
             <p class="footer__blurb">
               {{ settings()?.['tagline'] || config.tagline }}
             </p>
           </div>

          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/about">About Us</a></li>
              <li><a routerLink="/products">Products</a></li>
              <li><a routerLink="/services">Services</a></li>
              <li><a routerLink="/careers">Careers</a></li>
              <li><a routerLink="/services">Solutions</a></li>
            </ul>
          </div>

          <div>
            <h4>Resources</h4>
            <ul>
              <li><a routerLink="/insights">Insights & Blog</a></li>
              <li><a routerLink="/faq">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4>Products</h4>
            <ul>
              <li><a routerLink="/services/otuya-pos">Otuya POS</a></li>
              <li><a routerLink="/services/otuya-financials">Otuya Financials</a></li>
              <li><a routerLink="/services/otuya-ehealth-hospital-erp">Otuya Hospital ERP</a></li>
              <li><a routerLink="/services/otuya-insure">Otuya Insure</a></li>
              <li><a routerLink="/services/otuya-manufacturing-erp">Otuya Manufacturing ERP</a></li>
            </ul>
          </div>

           <div>
             <h4>Contact Us</h4>
             <ul class="footer__contact">
               <li *ngIf="settings()?.['contact_address']">{{ settings()?.['contact_address'] }}</li>
               <li *ngIf="settings()?.['contact_phone']">{{ settings()?.['contact_phone'] }}</li>
               <li *ngIf="settings()?.['contact_email']">
                 <a [href]="'mailto:' + settings()?.['contact_email']">{{ settings()?.['contact_email'] }}</a>
               </li>
               <li *ngIf="settings()?.['office_hours']" class="footer__hours">{{ settings()?.['office_hours'] }}</li>
             </ul>
           </div>

           <div>
             <h4>Follow us</h4>
             <p class="footer__social-blurb">Demos, tutorials, product updates and behind-the-scenes content.</p>
             <div class="footer__social-grid">
                <a *ngIf="social('tiktok')" [href]="social('tiktok')" target="_blank" rel="noopener" class="social-pill" aria-label="TikTok">
                  <img src="/images/social/tiktok.png?v=4" alt="TikTok" loading="lazy" decoding="async" />
                  <span>TikTok</span>
                </a>
                <a *ngIf="social('youtube')" [href]="social('youtube')" target="_blank" rel="noopener" class="social-pill" aria-label="YouTube">
                  <img src="/images/social/youtube.jpeg?v=4" alt="YouTube" loading="lazy" decoding="async" />
                  <span>YouTube</span>
                </a>
                <a *ngIf="social('linkedin')" [href]="social('linkedin')" target="_blank" rel="noopener" class="social-pill" aria-label="LinkedIn">
                  <img src="/images/social/linkedin.svg?v=4" alt="LinkedIn" loading="eager" />
                  <span>LinkedIn</span>
                </a>
                <a *ngIf="social('facebook')" [href]="social('facebook')" target="_blank" rel="noopener" class="social-pill" aria-label="Facebook">
                  <img src="/images/social/facebook.svg?v=4" alt="Facebook" loading="eager" />
                  <span>Facebook</span>
                </a>
                <a *ngIf="social('instagram')" [href]="social('instagram')" target="_blank" rel="noopener" class="social-pill" aria-label="Instagram">
                  <img src="/images/social/instagram.svg?v=4" alt="Instagram" loading="eager" />
                  <span>Instagram</span>
                </a>
             </div>
           </div>
         </div>

        <div class="footer__bottom">
          <span>&copy; {{ currentYear }} {{ config.siteName }}. All rights reserved.</span>
          <div class="footer__legal">
            <a routerLink="/privacy">Privacy Policy</a>
            <a routerLink="/terms">Terms of Service</a>
            <a routerLink="/cookies">Cookie Policy</a>
            <button type="button" class="footer__cookies" (click)="cookieConsent.requestSettings()">Cookie preferences</button>
          </div>
        </div>
      </div>
    </footer>
  `,
  styleUrl: './site-footer.component.scss',
})
export class SiteFooterComponent {
  readonly config = inject(APP_CONFIG);
  readonly currentYear = new Date().getFullYear();
  readonly settings = toSignal(inject(ApiService).settings(), { initialValue: null });
  protected readonly cookieConsent = inject(CookieConsentService);

  private static readonly DEFAULT_SOCIALS: Record<string, string> = {
    facebook: 'https://www.facebook.com/otuyaelite',
    linkedin: 'https://www.linkedin.com/company/otuyaelite',
    instagram: 'https://www.instagram.com/otuyaelite',
    tiktok: 'https://www.tiktok.com/@otuyaelite',
    youtube: 'https://www.youtube.com/@otuyaelite',
  };

  social(key: string): string {
    return this.settings()?.[`social_${key}`] || SiteFooterComponent.DEFAULT_SOCIALS[key] || '#';
  }
}