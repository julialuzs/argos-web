import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@env/environment';
import { Projeto } from '@shared/models/projeto';
import { Observable } from 'rxjs';

export type ProjetoRequest = {
  nome: string;
  descricao: string;
};

@Service()
export class ProjetoService {
  private readonly baseUrl = '/projetos';
  http = inject(HttpClient);

  listarProjetosPorUsuarioLogado(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(`${environment.apiUrl}${this.baseUrl}/listar`);
  }

  criarProjeto(request: ProjetoRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}${this.baseUrl}`, request);
  }
}
