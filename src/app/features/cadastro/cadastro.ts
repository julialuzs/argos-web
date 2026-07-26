import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '@shared/services/usuario.service';
import { matchFieldValidator } from '@shared/validators/match-field.validator';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputPasswordModule } from 'primeng/inputpassword';
import { InputTextModule } from 'primeng/inputtext';
import { LabelModule } from 'primeng/label';
import { MessageModule } from 'primeng/message';
import { CheckCircle } from '@primeicons/angular/check-circle';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UsuarioRequest } from '@shared/services/usuario';

const icons = [CheckCircle];
const primeNgModules = [
  InputPasswordModule,
  MessageModule,
  ButtonModule,
  CardModule,
  IconFieldModule,
  InputIconModule,
  LabelModule,
  InputTextModule,
  ToastModule,
];

@Component({
  selector: 'app-cadastro',
  imports: [ReactiveFormsModule, ...primeNgModules, ...icons],
  providers: [MessageService],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  private messageService = inject(MessageService);

  usuarioService = inject(UsuarioService);
  router = inject(Router);

  form = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.min(2), Validators.max(80)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.min(8)]),
    confirmacaoSenha: new FormControl('', [
      Validators.required,
      Validators.min(8),
      matchFieldValidator('senha'),
    ]),
  });

  formSubmitted = false;
  loading = signal(false);

  requirements = [
    { id: 'minLength', label: 'No mínimo 8 caracteres', test: (v: string) => v.length >= 8 },
    { id: 'uppercase', label: 'Contém letra maíscula', test: (v: string) => /[A-Z]/.test(v) },
    { id: 'lowercase', label: 'Contém letra minúscula', test: (v: string) => /[a-z]/.test(v) },
    { id: 'number', label: 'Contém números', test: (v: string) => /[0-9]/.test(v) },
  ];

  get request(): UsuarioRequest {
    return this.form.getRawValue() as UsuarioRequest;
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
    this.loading.set(true);
    this.formSubmitted = true;

    this.usuarioService.criarUsuario(this.request).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
        this.messageService.add({
          severity: 'success',
          summary: 'Usuário criado',
          detail: 'Usuário criado com sucesso.',
        });
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Algo deu errado',
          detail: 'A ação não pode ser concluída. Tente novamente mais tarde.',
        });
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
