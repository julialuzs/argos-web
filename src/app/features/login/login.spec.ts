import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let auth: { login: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    auth = {
      login: vi.fn().mockReturnValue(of({ token: 'jwt-token' })),
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), { provide: AuthService, useValue: auth }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call auth.login on submit', () => {
    component.form.setValue({ email: 'a@b.com', senha: 'secret' });
    component.onSubmit();

    expect(auth.login).toHaveBeenCalledWith({ email: 'a@b.com', senha: 'secret' });
  });

  it('should navigate to recuperar-senha', () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.redirectRecuperarSenha();

    expect(navigate).toHaveBeenCalledWith(['recuperar-senha']);
  });

  it('should navigate to projetos after login', () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.form.setValue({ email: 'a@b.com', senha: 'secret' });
    component.onSubmit();

    expect(navigate).toHaveBeenCalledWith(['/projetos']);
  });
});
