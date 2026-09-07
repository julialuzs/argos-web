import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@env/environment';
import { Relatorio, RelatorioDetalhe } from '@shared/models/relatorio';
import { Observable } from 'rxjs';

@Service()
export class RelatoriosService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/relatorios`;

  getRelatoriosPorProjeto(guidProjeto: string): Observable<Relatorio[]> {
    return this.http.get<Relatorio[]>(`${this.baseUrl}/${guidProjeto}/listar`);
  }

  getRelatorioPorId(guidProjeto: string, relatorioId: number): Observable<RelatorioDetalhe> {
    return this.http.get<RelatorioDetalhe>(`${this.baseUrl}/${guidProjeto}/${relatorioId}`);
  }

  executar(guidProjeto: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${guidProjeto}/executar`, {});
  }
}
