import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { environment } from '@env/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();

  if (token && isArgosApiRequest(req.url)) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        auth.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};

function isArgosApiRequest(url: string): boolean {
  if (url.startsWith(environment.apiUrl)) {
    return true;
  }

  if (!environment.apiUrl.startsWith('/')) {
    return false;
  }

  try {
    return new URL(url, 'http://localhost').pathname.startsWith(environment.apiUrl);
  } catch {
    return false;
  }
}
