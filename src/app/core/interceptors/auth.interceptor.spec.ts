import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import { Auth } from '../services/auth';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let auth: { getToken: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    auth = { getToken: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Auth, useValue: auth },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should attach Bearer token for API requests', () => {
    auth.getToken.mockReturnValue('jwt-token');

    http.get(`${environment.apiUrl}resource`).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}resource`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    req.flush({});
  });

  it('should not attach Authorization when there is no token', () => {
    auth.getToken.mockReturnValue(null);

    http.get(`${environment.apiUrl}resource`).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}resource`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
