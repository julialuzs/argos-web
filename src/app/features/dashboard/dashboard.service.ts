import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { DashboardDados } from './dashboard.model';

@Service()
export class DashboardService {
  private http = inject(HttpClient);

  getDashboard(guidProjeto: string): Observable<DashboardDados> {
    return this.http.get<DashboardDados>(`${environment.apiUrl}/projetos/${guidProjeto}/dashboard`);
  }
}
