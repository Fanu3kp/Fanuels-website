import { Component } from '@angular/core';
import { PageHeroComponent } from '../../shared/page-hero/page-hero.component';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [PageHeroComponent],
  template: `
    <app-page-hero
      eyebrow="Legal"
      title="Cookie Policy"
      subtitle="How we use cookies and similar technologies on our website"
      backgroundImage="/images/backgrounds/hero-bg.svg"
    />

    <section class="section">
      <div class="container legal">
        <h2>Cookie Policy</h2>
        <p class="legal__meta">Last updated: October 2026</p>

        <article>
          <h3>1. What Are Cookies</h3>
          <p>Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.</p>
        </article>

        <article>
          <h3>2. How We Use Cookies</h3>
          <p>We use cookies for the following purposes:</p>
          <ul>
            <li><strong>Essential cookies:</strong> Required for the website to function properly. These cannot be switched off.</li>
            <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website (e.g., Google Analytics).</li>
            <li><strong>Preference cookies:</strong> Remember your preferences and settings.</li>
          </ul>
        </article>

        <article>
          <h3>3. Third-Party Cookies</h3>
          <p>We may use third-party services such as Google Analytics, which may set their own cookies. These cookies are governed by the respective third-party privacy policies.</p>
        </article>

        <article>
          <h3>4. Managing Cookies</h3>
          <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.</p>
        </article>

        <article>
          <h3>5. Contact Us</h3>
          <p>If you have any questions about this Cookie Policy, please contact us:</p>
          <address>
            Otuya Global<br>
            Waiyaki Way, P.O. BOX 40034-00100, Nairobi, Kenya<br>
            <a href="mailto:info&#64;otuyaglobal.com">info&#64;otuyaglobal.com</a>
          </address>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .legal { max-width: 800px; }
    .legal__meta { color: var(--slate-500); margin-bottom: 32px; padding-bottom: 16px; border-bottom: 1px solid var(--slate-200); }
    article { margin-bottom: 32px; }
    h3 { color: var(--navy-900); margin-bottom: 12px; }
    p { color: var(--slate-600); line-height: 1.7; }
    ul { color: var(--slate-600); line-height: 1.7; padding-left: 20px; }
    li { margin-bottom: 8px; }
    address { font-style: normal; color: var(--slate-700); line-height: 1.7; }
    address a { color: var(--teal-500); }
  `],
})
export class CookiesComponent {}