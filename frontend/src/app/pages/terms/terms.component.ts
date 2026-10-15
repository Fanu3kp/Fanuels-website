import { Component } from '@angular/core';
import { PageHeroComponent } from '../../shared/page-hero/page-hero.component';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [PageHeroComponent],
  template: `
    <app-page-hero
      eyebrow="Legal"
      title="Terms of Service"
      subtitle="Terms and conditions governing the use of our website and services"
      backgroundImage="/images/backgrounds/hero-bg.svg"
    />

    <section class="section">
      <div class="container legal">
        <h2>Terms of Service</h2>
        <p class="legal__meta">Last updated: October 2026</p>

        <article>
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use this website.</p>
        </article>

        <article>
          <h3>2. Use of Website</h3>
          <p>You may use this website for lawful purposes only. You agree not to use the website in any way that violates any applicable law or regulation, or that could damage, disable, overburden, or impair the website.</p>
        </article>

        <article>
          <h3>3. Intellectual Property</h3>
          <p>All content on this website, including text, graphics, logos, images, and software, is the property of Otuya Global or its content suppliers and is protected by international copyright laws.</p>
        </article>

        <article>
          <h3>4. Services</h3>
          <p>Our services are subject to separate agreements. The information on this website is for general informational purposes only and does not constitute a binding offer or contract.</p>
        </article>

        <article>
          <h3>5. Limitation of Liability</h3>
          <p>In no event shall Otuya Global be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of this website or our services.</p>
        </article>

        <article>
          <h3>6. Governing Law</h3>
          <p>These terms shall be governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions.</p>
        </article>

        <article>
          <h3>7. Changes to Terms</h3>
          <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to this website. Your continued use of the website constitutes acceptance of the modified terms.</p>
        </article>

        <article>
          <h3>8. Contact Us</h3>
          <p>If you have any questions about these Terms of Service, please contact us:</p>
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
export class TermsComponent {}