import { inject, Service } from '@angular/core'; 
import { environment } from '../../../env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type UsuarioRequest = {
    nome: string;
    email: string;
    senha: string;
}

export type UsuarioResponse = {
    id: string;
    nome: string;
    email: string;
}

@Service()
export class UsuarioService {

    http = inject(HttpClient);

    getUsuario(): Observable<UsuarioResponse> {
        return this.http.get<UsuarioResponse>(`${environment.apiUrl}/usuarios`);
    }

    criarUsuario(request: UsuarioRequest): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/usuarios`, request);
    }
}
