import { Component, inject, Input, signal, Signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { LabelModule } from 'primeng/label';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';

import { DividerModule } from 'primeng/divider';
import { TextareaModule } from 'primeng/textarea';
import { ProjetoRequest, ProjetoService } from '../projeto.service';

const primeNgModules = [
  MessageModule,
  CardModule,
  ButtonModule,
  LabelModule,
  InputTextModule,
  DividerModule,
  DialogModule,
  TextareaModule,
];

@Component({
  selector: 'app-projeto-form',
  imports: [ReactiveFormsModule, ...primeNgModules],
  templateUrl: './projeto-form.html',
  styleUrl: './projeto-form.css',
})
export class ProjetoForm {
  @Input() visivel: WritableSignal<boolean> = signal(false);

  projetoService = inject(ProjetoService);
  formSubmitted = false;
  form = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    descricao: new FormControl('', [Validators.required]),
  });

  get request() {
    return this.form.getRawValue() as ProjetoRequest;
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  salvar() {
    this.projetoService.criarProjeto(this.request).subscribe(() => {
      this.fechar();
    });
  }

  fechar() {
    this.visivel.set(false);
  }
}
