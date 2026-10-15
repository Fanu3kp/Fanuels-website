import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../shared/page-hero/page-hero.component';
import { RevealDirective } from '../../shared/reveal/reveal.directive';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [RouterLink, PageHeroComponent, RevealDirective],
  template: `
    <app-page-hero
      eyebrow="Careers"
      title="Join Our Team"
      subtitle="Work where you're inspired, challenged & recognised."
      backgroundImage="/images/backgrounds/hero-bg.svg"
    />

    <section class="section">
      <div class="container center">
        <div class="careers__notice" appReveal="up">
          <h2>We're not hiring at the moment</h2>
          <p>
            Thank you for your interest in joining our team! Currently, we don't have any open positions,
            but we encourage you to stay connected. Follow us on social media or check back later for new opportunities.
          </p>
          <a routerLink="/contact?context=careers" class="btn btn--primary btn--lg" appReveal="up" [appRevealDelay]="100">Get in Touch</a>
        </div>

        <div class="careers__cta" appReveal="up" [appRevealDelay]="200">
          <h3>Ready to Transform Your Business?</h3>
          <p class="muted-copy">Let's discuss how our tailored solutions can drive growth and efficiency for your organization</p>
          <a routerLink="/contact?context=sales" class="btn btn--primary btn--lg">Let's Talk</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .center { text-align: center; }
    .muted-copy { color: var(--slate-500); max-width: 560px; margin: 0 auto 24px; }

    .careers__notice {
      max-width: 720px;
      margin: 0 auto;
      padding: 48px 24px;
      background: var(--slate-50);
      border-radius: var(--radius-xl);
      border: 1px solid var(--slate-200);
    }
    .careers__notice h2 {
      margin: 0 0 16px;
      color: var(--navy-900);
    }
    .careers__notice p {
      color: var(--slate-600);
      line-height: 1.7;
      margin-bottom: 24px;
    }

    .careers__cta {
      margin-top: 48px;
      padding: 48px 24px;
      background: linear-gradient(135deg, var(--navy-900), var(--navy-700));
      border-radius: var(--radius-xl);
      color: var(--white);
    }
    .careers__cta h3 {
      margin: 0 0 12px;
      color: var(--white);
    }
    .careers__cta .muted-copy { color: var(--slate-300); }
    .careers__cta .btn--primary { background: var(--teal-400); border-color: var(--teal-400); }
    .careers__cta .btn--primary:hover { background: var(--teal-300); border-color: var(--teal-300); }
  `],
})
export class CareersComponent {}