import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { environment } from '@env/environment';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { responseInterceptor } from '@core/interceptors/response.interceptor';
import { MessageService } from 'primeng/api';
import { argosPreset } from './preset';
import { DARK_MODE_CLASS, TemaService } from '@core/services/tema.service';
import { TamanhoFonteService } from '@core/services/tamanho-fonte.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor, responseInterceptor])),
    MessageService,
    provideAppInitializer(() => {
      inject(TemaService);
      inject(TamanhoFonteService);
    }),
    providePrimeNG({
      theme: {
        preset: argosPreset,
        options: {
          darkModeSelector: `.${DARK_MODE_CLASS}`,
        },
      },
      license: environment.primeNgLicenseKey,
    }),
  ],
};
