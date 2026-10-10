export interface OtuyaBusiness {
  key: string;
  name: string;
  descriptor: string;
  mark: string;
  blurb: string;
  accent: string;
  logo: string;
  image: string;
  siteUrl: string;
}

export const businesses: OtuyaBusiness[] = [
  {
    key: 'software',
    name: 'Otuya Software',
    descriptor: 'Custom software development & platforms',
    mark: '💻',
    blurb: 'Building scalable web applications, mobile apps, and web platforms. Modern stack, senior teams, delivery-focused.',
    accent: '#2563EB',
    logo: '/images/businesses/software-logo.svg',
    image: '/images/real/coding-session.svg',
    siteUrl: 'https://software.otuyaglobal.com',
  },
  {
    key: 'systems',
    name: 'Otuya Systems',
    descriptor: 'POS, ERP & enterprise systems',
    mark: '⚙️',
    blurb: 'Implementing and customizing POS systems, ERP platforms, and enterprise applications for retail, finance, and healthcare.',
    accent: '#059669',
    logo: '/images/businesses/systems-logo.svg',
    image: '/images/real/cloud-server.jpg',
    siteUrl: 'https://systems.otuyaglobal.com',
  },
  {
    key: 'cloud',
    name: 'Otuya Cloud',
    descriptor: 'Cloud infrastructure & migration',
    mark: '☁️',
    blurb: 'Cloud migrations, infrastructure optimization, and managed services on AWS, Azure, and Google Cloud.',
    accent: '#7C3AED',
    logo: '/images/businesses/cloud-logo.svg',
    image: '/images/real/cloud-architecture.svg',
    siteUrl: 'https://cloud.otuyaglobal.com',
  },
  {
    key: 'advisory',
    name: 'Otuya Advisory',
    descriptor: 'Digital transformation consulting',
    mark: '📊',
    blurb: 'Strategic advisory for technology adoption, workflow modernization, and process optimization.',
    accent: '#DC2626',
    logo: '/images/businesses/advisory-logo.svg',
    image: '/images/real/video-call.svg',
    siteUrl: 'https://advisory.otuyaglobal.com',
  },
];

export function businessUrl(business: OtuyaBusiness): string {
  return business.siteUrl;
}