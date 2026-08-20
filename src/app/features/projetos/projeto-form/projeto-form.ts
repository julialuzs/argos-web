import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

const primeNgModules = [
  MessageModule,
  CardModule,
  ButtonModule,
  LabelModule,
  InputTextModule,
  DividerModule,
  DialogModule,
  TextareaModule,
  ToastModule,
];

@Component({
  selector: 'app-projeto-form',
  imports: [ReactiveFormsModule, ...primeNgModules],
  providers: [MessageService],
  templateUrl: './projeto-form.html',
  styleUrl: './projeto-form.css',
})
export class ProjetoForm {
  @Input() visivel: WritableSignal<boolean> = signal(false);
  @Output() projetoCriado = new EventEmitter<void>();

  toastr = inject(MessageService);

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
      this.toastr.add({ severity: 'success', summary: 'Projeto criado com sucesso' });
      this.projetoCriado.emit();
      this.fechar();
    });
  }

  fechar() {
    this.visivel.set(false);
  }
}
