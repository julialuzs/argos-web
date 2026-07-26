import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Plus } from '@primeicons/angular/plus';
import { EllipsisV } from '@primeicons/angular/ellipsis-v';
import { Check } from '@primeicons/angular/check';
import { ProjetoSelecionadoService } from '@core/services/projeto-selecionado.service';
import { Projeto } from '@shared/models/projeto';
import { UsuarioService } from '@shared/services/usuario.service';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { ProjetoForm } from './projeto-form/projeto-form';
import { ProjetoService } from './projeto.service';

const primeNgModules = [DividerModule, ButtonModule, DataViewModule];

@Component({
  selector: 'app-projetos',
  imports: [...primeNgModules, Plus, Check, ProjetoForm, EllipsisV],
  templateUrl: './projetos.html',
  styleUrl: './projetos.css',
})
export class Projetos implements OnInit {
  // todo: add breadcrumbs
  projetos = signal<Projeto[]>([]);
  usuarioService = inject(UsuarioService);
  projetoService = inject(ProjetoService);
  projetoSelecionadoService = inject(ProjetoSelecionadoService);
  projetoFormVisivel = signal(false);

  router = inject(Router);

  ngOnInit(): void {
    this.projetoService.listarProjetosPorUsuarioLogado().subscribe((projetos) => {
      this.projetos.set(projetos);
    });
  }

  novoProjeto() {
    this.projetoFormVisivel.set(true);
  }

  selecionarProjeto(projeto: Projeto) {
    this.projetoSelecionadoService.selecionar(projeto);
  }
}
