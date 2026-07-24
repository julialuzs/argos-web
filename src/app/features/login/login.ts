import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputPasswordModule } from 'primeng/inputpassword';
import { Eye } from '@primeicons/angular/eye';
import { EyeSlash } from '@primeicons/angular/eye-slash';
import { ButtonModule } from 'primeng/button';
import { LoginRequest } from '@core/services/login-request';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { LabelModule } from 'primeng/label';
import { AuthService } from '@core/services/auth.service';
import { CardModule } from 'primeng/card';

const icons = [Eye, EyeSlash];
const primeNgModules = [
  InputPasswordModule,
  MessageModule,
  CardModule,
  ButtonModule,
  IconFieldModule,
  InputIconModule,
  LabelModule,
  InputTextModule,
];

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ...primeNgModules, ...icons],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  form = new FormGroup({
    email: new FormControl(''),
    senha: new FormControl(''),
  });

  mask = true;
  formSubmitted = false;

  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  get loginRequest(): LoginRequest {
    return this.form.getRawValue() as LoginRequest;
  }

  onSubmit(): void {
    this.error.set(null);
    this.loading.set(true);
    this.formSubmitted = true;

    this.auth.login(this.loginRequest).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['']);
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

  redirectCadastro() {
    this.router.navigate(['cadastro']);
  }
}
