export interface Product {
  id: string;
  name: string;
  category: 'software';
  description: string;
  features: string[];
  popular?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 'pos',
    name: 'POS System',
    category: 'software',
    description: 'Custom point-of-sale platform — offline-first, multi-location, integrated payments.',
    features: [
      'Offline-capable with background sync',
      'Multi-location & multi-currency',
      'Integrated payments (M-Pesa, Card, Cash)',
      'Real-time inventory & stock transfers',
      'Loyalty, promotions & gift cards',
      'Hardware-agnostic deployment',
    ],
    popular: true,
  },
  {
    id: 'apps',
    name: 'Mobile App',
    category: 'software',
    description: 'Native and cross-platform mobile applications built with React Native or Flutter.',
    features: [
      'iOS & Android from single codebase',
      'Offline-first architecture',
      'Push notifications & deep linking',
      'App Store / Play Store deployment',
      'Biometric auth & secure storage',
      'Over-the-air updates (CodePush)',
    ],
  },
  {
    id: 'websites',
    name: 'Website / Web Platform',
    category: 'software',
    description: 'Scalable web applications, portals, and platforms — SEO-ready, accessible.',
    features: [
      'React / Next.js / Angular frontends',
      'Node.js / Go / .NET backends',
      'Server-side rendering & SEO',
      'Role-based access & multi-tenancy',
      'Real-time with WebSockets / SSE',
      'WCAG 2.1 AA accessibility',
    ],
  },
  {
    id: 'erp',
    name: 'ERP Implementation',
    category: 'software',
    description: 'Proven methodology for ERP deployments minimizing risk and ensuring adoption.',
    features: [
      'Process mining & fit-gap analysis',
      'Industry templates for rapid deployment',
      'Automated data migration with validation',
      'API-first integration layer',
      'Role-based training & digital adoption',
      '90-day hypercare & optimization',
    ],
  },
];

export function getProductsByCategory(category: Product['category']): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function formatKsh(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}