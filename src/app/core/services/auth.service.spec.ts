import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import { AuthService } from './auth.service';

function toBase64Url(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function createFakeJwt(exp: number): string {
  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = toBase64Url(JSON.stringify({ exp }));
  return `${header}.${payload}.signature`;
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve persistir token ao fazer login e retornar true ao chamar isAuthenticated()', () => {
    expect(service.isAuthenticated()).toBe(false);

    service.login({ email: 'a@b.com', senha: 'segredo' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'jwt-token' });

    expect(service.getToken()).toBe('jwt-token');
    expect(service.isAuthenticated()).toBe(true);
    expect(localStorage.getItem('argos_auth_token')).toBe('jwt-token');
  });

  it('deve limpar token ao fazer logout', () => {
    service.login({ email: 'a@b.com', senha: 'segredo' }).subscribe();
    httpMock.expectOne(`${environment.apiUrl}/auth/login`).flush({ token: 'jwt-token' });

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('argos_auth_token')).toBeNull();
  });

  it('deve retornar true quando o token JWT não está expirado', () => {
    const validToken = createFakeJwt(Math.floor(Date.now() / 1000) + 3600);

    service.login({ email: 'a@b.com', senha: 'segredo' }).subscribe();
    httpMock.expectOne(`${environment.apiUrl}/auth/login`).flush({ token: validToken });

    expect(service.isAuthenticated()).toBe(true);
    expect(localStorage.getItem('argos_auth_token')).toBe(validToken);
  });

  it('deve limpar token e retornar false quando o token JWT está expirado', () => {
    const expiredToken = createFakeJwt(Math.floor(Date.now() / 1000) - 3600);

    service.login({ email: 'a@b.com', senha: 'segredo' }).subscribe();
    httpMock.expectOne(`${environment.apiUrl}/auth/login`).flush({ token: expiredToken });

    expect(service.isAuthenticated()).toBe(false);
    expect(service.getToken()).toBeNull();
    expect(localStorage.getItem('argos_auth_token')).toBeNull();
  });
});
