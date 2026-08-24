import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@env/environment';
import { Projeto } from '@shared/models/projeto';
import { Observable } from 'rxjs';

export type ProjetoRequest = {
  nome: string;
  descricao: string;
  urlBase: string;
  rotas: string[];
  incluirW3c: boolean;
};

@Service()
export class ProjetoService {
  private readonly baseUrl = '/projetos';
  http = inject(HttpClient);

  listarProjetosPorUsuarioLogado(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(`${environment.apiUrl}${this.baseUrl}/listar`);
  }

  getProjetoPorId(id: number): Observable<Projeto> {
    return this.http.get<Projeto>(`${environment.apiUrl}${this.baseUrl}/${id}`);
  }

  criarProjeto(request: ProjetoRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}${this.baseUrl}`, request);
  }

  editarProjeto(projeto: Projeto): Observable<void> {
    const request: ProjetoRequest = {
      nome: projeto.nome,
      descricao: projeto.descricao,
      urlBase: projeto.urlBase,
      rotas: projeto.rotas,
      incluirW3c: projeto.incluirW3c,
    };
    return this.http.put<void>(`${environment.apiUrl}${this.baseUrl}/${projeto.id}`, request);
  }
}
