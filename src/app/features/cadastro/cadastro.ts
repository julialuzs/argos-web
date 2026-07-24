import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService, UsuarioRequest } from '@shared/services/usuario.service';
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
];

@Component({
  selector: 'app-cadastro',
  imports: [ReactiveFormsModule, ...primeNgModules, ...icons],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  usuarioService = inject(UsuarioService);
  router = inject(Router);

  form = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.min(2), Validators.max(80)]),
    email: new FormControl('', [Validators.required]),
    senha: new FormControl('', [Validators.required, Validators.min(8)]),
    confirmacaoSenha: new FormControl('', [Validators.required, Validators.min(8)]),
  });

  formSubmitted = false;
  loading = signal(false);
  error = signal<string | null>(null);

  requirements = [
    { id: 'minLength', label: 'No mínimo 8 caracteres', test: (v: string) => v.length >= 8 },
    { id: 'uppercase', label: 'Contém letra maíscula', test: (v: string) => /[A-Z]/.test(v) },
    { id: 'lowercase', label: 'Contém letra minúscula', test: (v: string) => /[a-z]/.test(v) },
    { id: 'number', label: 'Contém números', test: (v: string) => /[0-9]/.test(v) },
    // {
    //   id: 'symbol',
    //   label: 'Contém caracteres especiais',
    //   test: (v: string) => /[^a-zA-Z0-9]/.test(v),
    // },
  ];

  get request(): UsuarioRequest {
    return this.form.getRawValue() as UsuarioRequest;
  }

  get senha(): string {
    return (this.form.get('senha')?.value as string) ?? '';
  }

  onSubmit(): void {
    this.error.set(null);
    this.loading.set(true);
    this.formSubmitted = true;

    this.usuarioService.criarUsuario(this.request).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/layout']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('E-mail ou senha incorretos.');
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
