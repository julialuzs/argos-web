import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Plus } from '@primeicons/angular/plus';
import { EllipsisV } from '@primeicons/angular/ellipsis-v';
import { Check } from '@primeicons/angular/check';
import { Copy } from '@primeicons/angular/copy';
import { ChevronRight } from '@primeicons/angular/chevron-right';
import { Receipt } from '@primeicons/angular/receipt';
import { ChartBar } from '@primeicons/angular/chart-bar';
import { ProjetoSelecionadoService } from '@core/services/projeto-selecionado.service';
import { Projeto } from '@shared/models/projeto';
import { UsuarioService } from '@shared/services/usuario.service';
import { MenuItem, MessageService } from 'primeng/api';
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
const icons = [Plus, EllipsisV, Check, ChevronRight, Copy, Receipt, ChartBar];

@Component({
  selector: 'app-projetos',
  imports: [...primeNgModules, ...icons, PrimeiraLetraPipe, DatePipe, ProjetoForm],
  templateUrl: './projetos.html',
  styleUrl: './projetos.css',
})
export class Projetos implements OnInit {
  usuarioService = inject(UsuarioService);
  projetoService = inject(ProjetoService);
  projetoSelecionadoService = inject(ProjetoSelecionadoService);
  messageService = inject(MessageService);
  projetoFormVisivel = signal(false);
  projetoEmEdicao = signal<Projeto | null>(null);
  loading = signal(true);

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
    this.loading.set(true);
    this.projetoService.listarProjetosPorUsuarioLogado().subscribe({
      next: (projetos) => {
        this.projetos.set(projetos);
        this.loading.set(false);
        const selecionado = this.projetoSelecionadoService.projetoSelecionado();
        if (selecionado) {
          const atualizado = projetos.find((projeto) => projeto.id === selecionado.id);
          if (atualizado) {
            this.projetoSelecionadoService.selecionar(atualizado);
          }
        }
      },
      error: () => this.loading.set(false),
    });
  }

  copiarGuid(guid: string) {
    navigator.clipboard.writeText(guid);
  }

  novoProjeto() {
    this.projetoEmEdicao.set(null);
    this.projetoFormVisivel.set(true);
  }

  selecionarProjeto(projeto: Projeto) {
    const jaSelecionado = this.estaSelecionado(projeto);
    this.projetoSelecionadoService.selecionar(projeto);
    if (!jaSelecionado) {
      this.messageService.add({
        severity: 'success',
        summary: `${projeto.nome} selecionado`,
        detail: 'Use Relatórios ou Dashboard no menu, ou os botões ao lado do projeto.',
      });
    }
  }

  irParaRelatorios(projeto: Projeto) {
    this.projetoSelecionadoService.selecionar(projeto);
    this.router.navigate([projeto.id, 'relatorios']);
  }

  irParaDashboard(projeto: Projeto) {
    this.projetoSelecionadoService.selecionar(projeto);
    this.router.navigate([projeto.id, 'dashboard']);
  }

  estaSelecionado(projeto: Projeto) {
    return this.projetoSelecionadoService.projetoSelecionado()?.id === projeto.id;
  }

  abrirMenu(event: Event, projeto: Projeto) {
    this.projetoDoMenu.set(projeto);
    this.menu()?.toggle(event);
  }

  editarProjeto(projeto: Projeto) {
    this.projetoEmEdicao.set(projeto);
    this.projetoFormVisivel.set(true);
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
