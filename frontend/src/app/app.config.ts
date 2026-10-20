import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withPreloading, PreloadAllModules } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth.interceptor';
import { APP_CONFIG } from '../environments/app-config.model';
import { appConfigData } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
      withPreloading(PreloadAllModules),
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: APP_CONFIG, useValue: appConfigData },
    provideServiceWorker('ngsw.json'),
  ],
};