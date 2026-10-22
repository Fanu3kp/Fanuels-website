import { Component, signal, computed } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../shared/page-hero/page-hero.component';
import { RevealDirective } from '../../shared/reveal/reveal.directive';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const MOCK_FAQS: FAQ[] = [
  {
    id: 1,
    question: 'What industries do you specialize in?',
    answer: 'We specialize in healthcare technology, financial technology (FinTech), insurance technology, manufacturing, education, and enterprise software solutions across Africa and beyond.',
    category: 'General'
  },
  {
    id: 2,
    question: 'What is Otuya Financials?',
    answer: 'Otuya Financials is a robust savings, credit, and pension management solution for financial institutions. It includes client/member portfolio management, savings & loans modules with risk analysis, microfinance management, automated reconciliation & reporting, regulatory compliance engine, and multi-currency & multi-branch support.',
    category: 'Products'
  },
  {
    id: 3,
    question: 'Do you offer hospital management solutions?',
    answer: 'Yes, Otuya e-Health Hospital ERP is a comprehensive hospital management system for multi-hospital networks. It provides centralized patient management, electronic health records (EHR) with lab/imaging integration, financial management & automated billing, pharmacy & inventory management, appointment & queue management, and telemedicine modules.',
    category: 'Products'
  },
  {
    id: 4,
    question: 'What is Otuya Insure?',
    answer: 'Otuya Insure is an end-to-end insurance SaaS technology for insurance distribution and management. It includes insurance master data management, multi-product definition engine, policy administration & lifecycle, claims processing & workflow, distribution & broker portal, and regulatory reporting & compliance.',
    category: 'Products'
  },
  {
    id: 5,
    question: 'What deployment options do you offer?',
    answer: 'We offer flexible deployment options including Software-as-a-Service (SaaS), cloud virtual servers, hybrid deployments, and on-premise hardware installations, depending on the product and client requirements.',
    category: 'Technical'
  },
  {
    id: 6,
    question: 'What technology platforms are you certified in?',
    answer: 'Our team holds certifications across major platforms including AWS, Microsoft Azure, Google Cloud, and various ERP platforms. We maintain partnership status with leading technology vendors.',
    category: 'Technical'
  },
  {
    id: 7,
    question: 'Do you provide training and support?',
    answer: 'Yes, we offer comprehensive training & capacity building services, 24/7 support & maintenance, and ongoing capacity building programs to ensure your team can effectively use and maintain our solutions.',
    category: 'Support'
  },
  {
    id: 8,
    question: 'What makes Otuya Global different?',
    answer: 'Otuya Global combines senior engineering rigor with deep domain expertise across every engagement. Our unique model shares engineering, cloud, security, and finance infrastructure across all business units while each specialist unit owns its market and outcomes. We measure success by measurable business results delivered, not hours billed.',
    category: 'Company'
  }
];

const CATEGORIES = ['All', 'General', 'Products', 'Technical', 'Support', 'Company'];

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterLink, PageHeroComponent, RevealDirective],
  template: `
    <app-page-hero
      eyebrow="Support"
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions about our services, products, and how we can help your business thrive."
      backgroundImage="images/backgrounds/contact-bg.svg"
    />

    <section class="section">
      <div class="container">
        <div class="faq-search" appReveal="up">
          <input
            type="search"
            placeholder="Search FAQs..."
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearchChange($event)"
            class="search-input"
            aria-label="Search FAQs"
          />
        </div>

        <div class="faq-filters" appReveal="up" [appRevealDelay]="100">
          <button
            class="filter-chip"
            *ngFor="let cat of CATEGORIES"
            [class.active]="selectedCategory() === cat"
            (click)="selectCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>

        <div class="faq-list" *ngIf="filteredFAQs().length; else noResults">
          <details
            class="faq-item"
            *ngFor="let faq of filteredFAQs(); let i = index"
            appReveal="up"
            [appRevealDelay]="i * 50"
          >
            <summary>{{ faq.question }}</summary>
            <div class="faq-answer">{{ faq.answer }}</div>
          </details>
        </div>

        <ng-template #noResults>
          <div class="empty-state" appReveal="up">
            <h3>No matching FAQs found</h3>
            <p>Try adjusting your search or filter.</p>
          </div>
        </ng-template>

        <div class="faq-cta" appReveal="up" [appRevealDelay]="200">
          <h3>Still have questions?</h3>
          <p>Can't find the answer you're looking for? Our support team is here to help you with any questions.</p>
          <a routerLink="/contact" class="btn btn--primary btn--lg">Contact Support</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .faq-search { margin-bottom: 32px; }
    .search-input {
      width: 100%;
      max-width: 600px;
      padding: 16px 20px;
      border: 1.5px solid var(--slate-300);
      border-radius: var(--radius-lg);
      font-size: 1rem;
      background: var(--white);
      color: var(--navy-900);
      transition: all 0.2s ease;
    }
    .search-input:focus {
      border-color: var(--teal-400);
      box-shadow: 0 0 0 4px rgba(0, 172, 193, 0.12);
      outline: none;
    }

    .faq-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 32px;
    }
    .filter-chip {
      padding: 8px 18px;
      border-radius: 999px;
      border: 1px solid var(--slate-300);
      background: var(--white);
      font-family: inherit;
      font-size: 0.88rem;
      font-weight: 500;
      color: var(--slate-700);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .filter-chip:hover { border-color: var(--slate-500); }
    .filter-chip.active { background: var(--navy-800); border-color: var(--navy-800); color: var(--white); }

    .faq-list { display: flex; flex-direction: column; gap: 12px; }
    .faq-item {
      background: var(--white);
      border: 1px solid var(--slate-200);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    .faq-item summary {
      padding: 20px 24px;
      font-weight: 600;
      color: var(--navy-900);
      cursor: pointer;
      list-style: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .faq-item summary::-webkit-details-marker { display: none; }
    .faq-item summary::after {
      content: '+';
      font-size: 1.25rem;
      color: var(--teal-500);
      transition: transform 0.2s ease;
    }
    .faq-item[open] summary::after { transform: rotate(45deg); }
    .faq-answer {
      padding: 0 24px 20px;
      color: var(--slate-600);
      line-height: 1.7;
      border-top: 1px solid var(--slate-200);
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--slate-500);
    }
    .empty-state h3 { margin-bottom: 8px; color: var(--navy-900); }

    .faq-cta {
      margin-top: 48px;
      padding: 48px;
      background: var(--slate-50);
      border-radius: var(--radius-xl);
      text-align: center;
      border: 1px solid var(--slate-200);
    }
    .faq-cta h3 { margin-bottom: 12px; color: var(--navy-900); }
    .faq-cta p { color: var(--slate-600); margin-bottom: 24px; max-width: 560px; margin-left: auto; margin-right: auto; }

    @media (max-width: 768px) {
      .faq-item summary { padding: 16px; }
      .faq-answer { padding: 0 16px 16px; }
    }
  `],
})
export class FAQComponent {
  readonly CATEGORIES = CATEGORIES;
  readonly searchTerm = signal('');
  readonly selectedCategory = signal('All');
  readonly faqs = signal(MOCK_FAQS);

  readonly filteredFAQs = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const cat = this.selectedCategory();

    return this.faqs().filter(faq => {
      const matchesSearch = !term ||
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term);
      const matchesCategory = cat === 'All' || faq.category === cat;
      return matchesSearch && matchesCategory;
    });
  });

  onSearchChange(term: string) {
    this.searchTerm.set(term);
  }

  selectCategory(cat: string) {
    this.selectedCategory.set(cat);
  }
}
