import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { RecuperarSenha } from './recuperar-senha';

describe('RecuperarSenha', () => {
  let component: RecuperarSenha;
  let fixture: ComponentFixture<RecuperarSenha>;
  let auth: { redefinirSenha: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    auth = {
      redefinirSenha: vi.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [RecuperarSenha],
      providers: [provideRouter([]), { provide: AuthService, useValue: auth }],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarSenha);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call auth.redefinirSenha on submit and navigate to login', () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.form.setValue({
      email: 'a@b.com',
      senha: 'Senha123',
      confirmacaoSenha: 'Senha123',
    });
    component.onSubmit();

    expect(auth.redefinirSenha).toHaveBeenCalledWith({
      email: 'a@b.com',
      senha: 'Senha123',
      confirmacaoSenha: 'Senha123',
    });
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show a message when the email is not registered', () => {
    auth.redefinirSenha.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404 })),
    );

    component.form.setValue({
      email: 'ausente@b.com',
      senha: 'Senha123',
      confirmacaoSenha: 'Senha123',
    });
    component.onSubmit();

    expect(component.error()).toBe('E-mail não cadastrado.');
  });
});
