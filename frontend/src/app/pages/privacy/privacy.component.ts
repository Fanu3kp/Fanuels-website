import { Component } from '@angular/core';
import { PageHeroComponent } from '../../shared/page-hero/page-hero.component';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [PageHeroComponent],
  template: `
    <app-page-hero
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your personal information"
      backgroundImage="images/backgrounds/hero-bg.svg"
    />

    <section class="section">
      <div class="container legal">
        <h2>Privacy Policy</h2>
        <p class="legal__meta">Last updated: October 2026</p>

        <article>
          <h3>1. Information We Collect</h3>
          <p>We collect information you provide directly to us, such as when you fill out a contact form, subscribe to our newsletter, or request a quote. This may include your name, email address, phone number, company name, and message content.</p>
        </article>

        <article>
          <h3>2. How We Use Your Information</h3>
          <p>We use the information we collect to respond to your inquiries, provide you with information about our services, improve our website, and comply with legal obligations.</p>
        </article>

        <article>
          <h3>3. Information Sharing</h3>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, subject to confidentiality obligations.</p>
        </article>

        <article>
          <h3>4. Data Security</h3>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        </article>

        <article>
          <h3>5. Your Rights</h3>
          <p>You have the right to access, correct, or delete your personal information. You may also object to or restrict the processing of your data. To exercise these rights, please contact us at the address below.</p>
        </article>

        <article>
          <h3>6. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
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
    address { font-style: normal; color: var(--slate-700); line-height: 1.7; }
    address a { color: var(--teal-500); }
  `],
})
export class PrivacyComponent {}
