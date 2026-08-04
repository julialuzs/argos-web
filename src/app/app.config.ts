import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { environment } from '@env/environment';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { responseInterceptor } from '@core/interceptors/response.interceptor';
import { MessageService } from 'primeng/api';
import { argosPreset } from './preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor, responseInterceptor])),
    MessageService,
    providePrimeNG({
        theme: {
            preset: argosPreset,
        },
        license: environment.primeNgLicenseKey
    })
  ]
};
