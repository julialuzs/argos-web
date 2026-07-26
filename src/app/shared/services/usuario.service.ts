import { inject, Service } from '@angular/core';
import { environment } from '../../../env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioLogado, UsuarioResponse, UsuarioRequest } from './usuario';

@Service()
export class UsuarioService {
  private readonly baseUrl = '/usuarios';
  http = inject(HttpClient);

  getUsuarioLogado(): Observable<UsuarioLogado> {
    return this.http.get<UsuarioLogado>(`${environment.apiUrl}${this.baseUrl}/logado`);
  }

  getUsuario(): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${environment.apiUrl}${this.baseUrl}`);
  }

  criarUsuario(request: UsuarioRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}${this.baseUrl}`, request);
  }
}
