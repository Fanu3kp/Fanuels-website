import { InjectionToken } from '@angular/core';

export interface AppConfigData {
  apiUrl: string;
  siteName: string;
  tagline: string;
}

export const APP_CONFIG = new InjectionToken<AppConfigData>('APP_CONFIG');