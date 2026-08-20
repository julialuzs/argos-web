import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Plus } from '@primeicons/angular/plus';
import { EllipsisV } from '@primeicons/angular/ellipsis-v';
import { Check } from '@primeicons/angular/check';
import { ChevronRight } from '@primeicons/angular/chevron-right';
import { ProjetoSelecionadoService } from '@core/services/projeto-selecionado.service';
import { Projeto } from '@shared/models/projeto';
import { UsuarioService } from '@shared/services/usuario.service';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { Menu, MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';
import { ProjetoForm } from './projeto-form/projeto-form';
import { ProjetoService } from './projeto.service';
import { DatePipe } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { PrimeiraLetraPipe } from '@shared/pipes/primeira-letra-pipe';

const primeNgModules = [DividerModule, ButtonModule, DataViewModule, BadgeModule, MenuModule];
const icons = [Plus, EllipsisV, Check, ChevronRight];

@Component({
  selector: 'app-projetos',
  imports: [...primeNgModules, ...icons, PrimeiraLetraPipe, DatePipe, ProjetoForm],
  templateUrl: './projetos.html',
  styleUrl: './projetos.css',
})
export class Projetos implements OnInit {
  // todo: add breadcrumbs

  usuarioService = inject(UsuarioService);
  projetoService = inject(ProjetoService);
  projetoSelecionadoService = inject(ProjetoSelecionadoService);
  projetoFormVisivel = signal(false);

  projetos = signal<Projeto[]>([]);

  router = inject(Router);
  menu = viewChild<Menu>('menu');
  projetoDoMenu = signal<Projeto | null>(null);

  itensMenu: MenuItem[] = [
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      command: () => this.executarComandoMenu((p) => this.editarProjeto(p)),
    },
    { separator: true },
    {
      label: 'Excluir',
      icon: 'pi pi-trash',
      command: () => this.executarComandoMenu((p) => this.excluirProjeto(p)),
    },
  ];

  ngOnInit(): void {
    this.getProjetos();
  }

  getProjetos() {
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

  estaSelecionado(projeto: Projeto) {
    return this.projetoSelecionadoService.projetoSelecionado()?.id === projeto.id;
  }

  abrirMenu(event: Event, projeto: Projeto) {
    this.projetoDoMenu.set(projeto);
    this.menu()?.toggle(event);
  }

  editarProjeto(projeto: Projeto) {
    this.projetoService.editarProjeto(projeto).subscribe(() => {
      this.getProjetos();
    });
  }

  excluirProjeto(projeto: Projeto) {
    console.log('excluir', projeto);
  }

  private executarComandoMenu(acao: (projeto: Projeto) => void) {
    const projeto = this.projetoDoMenu();
    if (projeto) {
      acao(projeto);
    }
  }
}
