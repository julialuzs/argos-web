import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { RedefinirSenhaRequest } from '@core/services/redefinir-senha-request';
import { matchFieldValidator } from '@shared/validators/match-field.validator';
import { CheckCircle } from '@primeicons/angular/check-circle';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputPasswordModule } from 'primeng/inputpassword';
import { LabelModule } from 'primeng/label';
import { MessageModule } from 'primeng/message';

const icons = [CheckCircle];
const primeNgModules = [
  InputPasswordModule,
  MessageModule,
  ButtonModule,
  CardModule,
  LabelModule,
  InputTextModule,
];

const senhaPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

@Component({
  selector: 'app-recuperar-senha',
  imports: [ReactiveFormsModule, RouterLink, ...primeNgModules, ...icons],
  templateUrl: './recuperar-senha.html',
  styleUrl: './recuperar-senha.css',
})
export class RecuperarSenha {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(100),
      Validators.pattern(senhaPattern),
    ]),
    confirmacaoSenha: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      matchFieldValidator('senha'),
    ]),
  });

  formSubmitted = false;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  requirements = [
    { id: 'minLength', label: 'No mínimo 8 caracteres', test: (v: string) => v.length >= 8 },
    { id: 'uppercase', label: 'Contém letra maíscula', test: (v: string) => /[A-Z]/.test(v) },
    { id: 'lowercase', label: 'Contém letra minúscula', test: (v: string) => /[a-z]/.test(v) },
    { id: 'number', label: 'Contém números', test: (v: string) => /[0-9]/.test(v) },
  ];

  get request(): RedefinirSenhaRequest {
    return this.form.getRawValue() as RedefinirSenhaRequest;
  }

  get senha(): string {
    return (this.form.get('senha')?.value as string) ?? '';
  }

  get formValido() {
    return this.form.valid;
  }

  constructor() {
    this.form
      .get('senha')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.form.get('confirmacaoSenha')?.updateValueAndValidity({ emitEvent: false });
      });
  }

  onSubmit(): void {
    this.error.set(null);
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);

    this.auth.redefinirSenha(this.request).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(
          err.status === 404
            ? 'E-mail não cadastrado.'
            : 'A ação não pode ser concluída. Tente novamente mais tarde.',
        );
      },
    });
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  redirectLogin() {
    this.router.navigate(['login']);
  }
}
