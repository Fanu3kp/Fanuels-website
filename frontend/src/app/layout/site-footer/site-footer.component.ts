import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/api.service';
import { APP_CONFIG } from '../../../environments/app-config.model';

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
<div class="footer__social">
              <a [href]="social('facebook')" target="_blank" rel="noopener" aria-label="Facebook">
                <img src="/images/social/facebook.svg" alt="Facebook" />
              </a>
              <a [href]="social('linkedin')" target="_blank" rel="noopener" aria-label="LinkedIn">
                <img src="/images/social/linkedin.svg" alt="LinkedIn" />
              </a>
              <a [href]="social('instagram')" target="_blank" rel="noopener" aria-label="Instagram">
                <img src="/images/social/instagram.svg" alt="Instagram" />
              </a>
              <a [href]="social('tiktok')" target="_blank" rel="noopener" aria-label="TikTok">
                <img src="/images/social/tiktok.svg" alt="TikTok" />
              </a>
              <a [href]="social('youtube')" target="_blank" rel="noopener" aria-label="YouTube">
                <img src="/images/social/youtube.svg" alt="YouTube" />
              </a>
            </div>
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
        </div>

        <div class="footer__bottom">
          <span>&copy; {{ currentYear }} {{ config.siteName }}. All rights reserved.</span>
          <div class="footer__legal">
            <a routerLink="/privacy">Privacy Policy</a>
            <a routerLink="/terms">Terms of Service</a>
            <a routerLink="/cookies">Cookie Policy</a>
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