import { AppConfigData } from './app-config.model';

export const appConfigData: AppConfigData = {
  // Separately hosted Laravel API (Render free tier).
  // The render.yaml at the repo root deploys backend/ as the
  // "otuya-api" web service; its free URL is predictable.
  apiUrl: 'https://otuya-api.onrender.com/api',
  siteName: 'Otuya Global',
  tagline: 'We build POS, apps, websites, ERP. Technology solutions for modern businesses.',
};