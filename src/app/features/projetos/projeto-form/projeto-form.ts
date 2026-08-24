import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  WritableSignal,
  effect,
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
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ProjetoRequest, ProjetoService } from '../projeto.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Projeto } from '@shared/models/projeto';

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
  ToggleSwitchModule,
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
  @Input() projeto: WritableSignal<Projeto | null> = signal(null);
  @Output() projetoCriado = new EventEmitter<void>();

  toastr = inject(MessageService);
  projetoService = inject(ProjetoService);
  formSubmitted = false;

  form = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    descricao: new FormControl('', [Validators.required]),
    urlBase: new FormControl('', [Validators.required, Validators.pattern(/^https?:\/\/.+/i)]),
    rotas: new FormControl('/', [Validators.required]),
    incluirW3c: new FormControl(false, { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      if (!this.visivel()) {
        return;
      }

      this.formSubmitted = false;
      const projeto = this.projeto();
      if (projeto) {
        this.form.reset({
          nome: projeto.nome,
          descricao: projeto.descricao,
          urlBase: projeto.urlBase ?? '',
          rotas: (projeto.rotas?.length ? projeto.rotas : ['/']).join('\n'),
          incluirW3c: projeto.incluirW3c ?? false,
        });
      } else {
        this.form.reset({
          nome: '',
          descricao: '',
          urlBase: '',
          rotas: '/',
          incluirW3c: false,
        });
      }
    });
  }

  get titulo() {
    return this.projeto() ? 'Editar projeto' : 'Novo projeto';
  }

  get request(): ProjetoRequest {
    const raw = this.form.getRawValue();
    const rotas = (raw.rotas ?? '')
      .split('\n')
      .map((rota) => rota.trim())
      .filter((rota) => rota.length > 0);

    return {
      nome: raw.nome ?? '',
      descricao: raw.descricao ?? '',
      urlBase: (raw.urlBase ?? '').trim(),
      rotas: rotas.length > 0 ? rotas : ['/'],
      incluirW3c: raw.incluirW3c,
    };
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  salvar() {
    this.formSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    const atual = this.projeto();
    const request$ = atual
      ? this.projetoService.editarProjeto({ ...atual, ...this.request })
      : this.projetoService.criarProjeto(this.request);

    request$.subscribe(() => {
      this.toastr.add({
        severity: 'success',
        summary: atual ? 'Projeto atualizado com sucesso' : 'Projeto criado com sucesso',
      });
      this.projetoCriado.emit();
      this.fechar();
    });
  }

  fechar() {
    this.visivel.set(false);
  }
}
