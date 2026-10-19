import { Service } from './models';

/**
 * Static product catalogue. The live catalogue lives in the Laravel
 * API, but product detail pages must render even when the API is
 * unreachable (static hosting), so the same entries back both the
 * products listing and the service/product detail fallback.
 */
export const MOCK_PRODUCTS: Service[] = [
  {
    id: 1,
    title: 'Otuya POS',
    slug: 'otuya-pos',
    summary: 'Comprehensive point-of-sale and retail management system for modern retail operations.',
    body: '',
    icon: 'pos',
    image: '/images/solutions/pos-software.jpg',
    highlights: [
      'Multi-store POS Management',
      'Real-time Inventory Tracking & Management',
      'Customer Loyalty & Rewards Programs',
      'Integrated Payments (Stripe, Adyen, local)',
      'Hardware-agnostic: tablets, terminals, kiosks',
      'Offline-capable with background sync'
    ],
    sort_order: 1,
    is_featured: true,
    is_active: true
  },
  {
    id: 2,
    title: 'Otuya Financials',
    slug: 'otuya-financials',
    summary: 'A robust savings, credit, and pension management solution for financial institutions.',
    body: '',
    icon: 'finance',
    image: '/images/solutions/erp-business-central.svg',
    highlights: [
      'Client/Member Portfolio Management',
      'Savings & Loans Modules with Risk Analysis',
      'Microfinance Management',
      'Automated Reconciliation & Reporting',
      'Regulatory Compliance Engine',
      'Multi-currency & Multi-branch Support'
    ],
    sort_order: 2,
    is_featured: true,
    is_active: true
  },
  {
    id: 3,
    title: 'Otuya e-Health Hospital ERP',
    slug: 'otuya-ehealth-hospital-erp',
    summary: 'Comprehensive hospital management system for multi-hospital networks.',
    body: '',
    icon: 'health',
    image: '/images/solutions/erp-supply-chain.jpg',
    highlights: [
      'Centralized Patient Management across multiple hospitals',
      'Electronic Health Records (EHR) with lab/imaging integration',
      'Financial Management & Automated Billing',
      'Pharmacy & Inventory Management',
      'Appointment & Queue Management',
      'Telemedicine & Remote Consultation Module'
    ],
    sort_order: 3,
    is_featured: true,
    is_active: true
  },
  {
    id: 4,
    title: 'Otuya Insure',
    slug: 'otuya-insure',
    summary: 'End-to-end insurance SaaS technology for insurance distribution and management.',
    body: '',
    icon: 'insure',
    image: '/images/solutions/apps-photo.jpg',
    highlights: [
      'Insurance Master Data Management',
      'Multi-Product Definition Engine',
      'Policy Administration & Lifecycle',
      'Claims Processing & Workflow',
      'Distribution & Broker Portal',
      'Regulatory Reporting & Compliance'
    ],
    sort_order: 4,
    is_featured: true,
    is_active: true
  },
  {
    id: 5,
    title: 'Otuya Pension Management System',
    slug: 'otuya-pension-management',
    summary: 'Comprehensive pension administration and management solution.',
    body: '',
    icon: 'pension',
    image: '/images/solutions/website-photo.jpg',
    highlights: [
      'Member Registration & Lifecycle Management',
      'Contribution Processing & Reconciliation',
      'Benefit Calculation & Disbursement',
      'Investment Management & Reporting',
      'Regulatory Compliance & Reporting',
      'Member Self-Service Portal'
    ],
    sort_order: 5,
    is_featured: true,
    is_active: true
  },
  {
    id: 6,
    title: 'Otuya Manufacturing ERP',
    slug: 'otuya-manufacturing-erp',
    summary: 'Smart manufacturing ERP with real-time production monitoring and AI-driven insights.',
    body: '',
    icon: 'manufacturing',
    image: '/images/solutions/erp-supply-chain.jpg',
    highlights: [
      'Real-time Production Monitoring Dashboard',
      'Predictive Maintenance Scheduling',
      'Quality Management & Traceability',
      'Supply Chain & Procurement Automation',
      'MES/ERP Convergence',
      'OT/IT Security Integration'
    ],
    sort_order: 6,
    is_featured: false,
    is_active: true
  },
  {
    id: 7,
    title: 'Otuya CRM',
    slug: 'otuya-crm',
    summary: 'Customized CRM solution for streamlined customer engagement and data-driven insights.',
    body: '',
    icon: 'crm',
    image: '/images/real/coding-session.svg',
    highlights: [
      'Lead & Opportunity Management',
      'Contact & Account Management',
      'Sales Pipeline & Forecasting',
      'Marketing Automation & Campaigns',
      'Customer Service & Ticketing',
      'Analytics & Custom Dashboards'
    ],
    sort_order: 7,
    is_featured: false,
    is_active: true
  },
  {
    id: 8,
    title: 'Otuya Case & Contract Management',
    slug: 'otuya-case-contract-management',
    summary: 'Web-based system for efficient case and contract management with notification engine.',
    body: '',
    icon: 'legal',
    image: '/images/real/meeting-room.jpg',
    highlights: [
      'Case Lifecycle Management',
      'Contract Creation & Templates',
      'Document Management & Versioning',
      'Automated Notifications & Reminders',
      'Compliance & Audit Trails',
      'Multi-party Collaboration Workspace'
    ],
    sort_order: 8,
    is_featured: false,
    is_active: true
  },
  {
    id: 9,
    title: 'Otuya Academics',
    slug: 'otuya-academics',
    summary: 'Microservice-powered e-learning platform for delivering quality education.',
    body: '',
    icon: 'education',
    image: '/images/products/otuya-academics.svg',
    highlights: [
      'Course Creation & Management',
      'Student Progress Tracking',
      'Assessment & Certification Engine',
      'Virtual Classroom & Live Sessions',
      'Content Library & Resource Management',
      'Analytics & Learning Insights'
    ],
    sort_order: 9,
    is_featured: false,
    is_active: true
  }
];
