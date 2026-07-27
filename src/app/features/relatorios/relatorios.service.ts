import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@env/environment';
import { Relatorio } from '@shared/models/relatorio';

@Service()
export class RelatoriosService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/relatorios`;

  getRelatoriosPorProjeto(projetoId: number) {
    return this.http.get<Relatorio[]>(`${this.baseUrl}/${projetoId}/listar`);
  }

  getRelatorioPorId(projetoId: number, relatorioId: number) {
    return this.http.get<Relatorio[]>(`${this.baseUrl}/${projetoId}/${relatorioId}`);
  }
}
