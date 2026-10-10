import { AppConfigData } from './app-config.model';

export const appConfigData: AppConfigData = {
  // Same-origin API (XAMPP / VPS running the Laravel backend).
  // GitHub Pages is static and has no API — when hosting the frontend on
  // GitHub Pages, point this at your separately hosted Laravel API,
  // e.g. 'https://api.example.com/api'. Without a live API the site
  // renders its built-in demo data, but the contact form cannot
  // store messages or send email.
  apiUrl: '/api',
  siteName: 'Otuya Global',
  tagline: 'We build POS, apps, websites, ERP. Technology solutions for modern businesses.',
};