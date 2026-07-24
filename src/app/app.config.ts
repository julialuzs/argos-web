import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { environment } from '@env/environment';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { argosPreset } from './preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    providePrimeNG({
        theme: {
            preset: argosPreset,
        },
        license: environment.primeNgLicenseKey
    })
  ]
};
