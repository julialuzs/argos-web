import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(MessageService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 0) {
        const message = 'Não foi possível conectar ao servidor. Tente novamente mais tarde.';
        toastr.add({ severity: 'error', summary: 'Erro de conexão', detail: message });
        return throwError(() => new Error(message));
      }

      if (
        err.status === HttpStatusCode.BadRequest ||
        err.status === HttpStatusCode.InternalServerError
      ) {
        const message = err.error?.message ?? 'Ocorreu um erro inesperado.';
        toastr.add({ severity: 'error', summary: 'Erro', detail: message });
        return throwError(() => new Error(message));
      }

      return throwError(() => err);
    }),
  );
};
