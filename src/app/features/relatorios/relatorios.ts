import { Component, computed, effect, inject, OnDestroy, signal, untracked } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { RelatoriosService } from './relatorios.service';
import { ProjetoSelecionadoService } from '@core/services/projeto-selecionado.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { Refresh } from '@primeicons/angular/refresh';
import { Receipt } from '@primeicons/angular/receipt';
import { Bolt } from '@primeicons/angular/bolt';
import { Router } from '@angular/router';
import { ChevronRight } from '@primeicons/angular/chevron-right';
import { Relatorio } from '@shared/models/relatorio';
import { ProjetoService } from '@features/projetos/projeto.service';
import { forkJoin, interval, Subscription } from 'rxjs';

const primeNgModules = [TableModule, DividerModule, TagModule, ButtonModule, MessageModule];
const icons = [Refresh, Receipt, ChevronRight, Bolt];

@Component({
  selector: 'app-relatorios',
  imports: [DatePipe, ...icons, ...primeNgModules],
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.css',
})
export class Relatorios implements OnDestroy {
  private projetoSelecionadoService = inject(ProjetoSelecionadoService);
  private relatoriosService = inject(RelatoriosService);
  private projetoService = inject(ProjetoService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  relatorios = signal<Relatorio[]>([]);
  projeto = computed(() => this.projetoSelecionadoService.projetoSelecionado());
  loading = signal(false);
  executando = signal(false);

  private pollSub?: Subscription;
  private pollTimeout?: ReturnType<typeof setTimeout>;
  private readonly projetoId = computed(() => this.projeto()?.id ?? null);
  private readonly sincronizarProjeto = effect(() => {
    const projetoId = this.projetoId();
    untracked(() => this.aoAlterarProjeto(projetoId));
  });

  ngOnDestroy() {
    this.pararPolling();
  }

  getRelatorios() {
    const projeto = this.projeto();
    if (!projeto) {
      return;
    }

    this.loading.set(true);
    this.relatoriosService.getRelatoriosPorProjeto(projeto.id).subscribe({
      next: (relatorios) => {
        this.relatorios.set(relatorios);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao carregar os relatórios',
          detail: 'Erro ao carregar os relatórios. Tente novamente mais tarde.',
        });
      },
    });
  }

  executarAnalise() {
    const projeto = this.projeto();
    if (!projeto) {
      return;
    }

    if (!projeto.urlBase?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'URL não cadastrada',
        detail: 'Cadastre a URL base do projeto antes de executar a análise.',
      });
      return;
    }

    this.executando.set(true);
    const startedAt = Date.now();
    this.relatoriosService.executar(projeto.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Análise iniciada',
          detail: 'A avaliação pode levar alguns minutos. A lista será atualizada automaticamente.',
        });
        this.iniciarPolling(startedAt, false);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Análise em andamento',
            detail: err.error?.message ?? 'Já existe uma análise em andamento para este projeto.',
          });
          this.iniciarPolling(startedAt, true);
          return;
        }

        this.executando.set(false);
        if (err.status !== 400) {
          this.messageService.add({
            severity: 'error',
            summary: 'Não foi possível iniciar a análise',
            detail: err.error?.message ?? 'Tente novamente mais tarde.',
          });
        }
      },
    });
  }

  irParaRelatorio(relatorioId: number) {
    this.router.navigate([this.projeto()!.id, 'relatorios', relatorioId]);
  }

  irParaProjetos() {
    this.router.navigate(['/projetos']);
  }

  getSeverity(pontuacao: number) {
    if (pontuacao >= 90) {
      return 'success';
    }
    if (pontuacao >= 70) {
      return 'warn';
    }

    return 'danger';
  }

  private aoAlterarProjeto(projetoId: number | null) {
    this.pararPolling();
    this.executando.set(false);

    if (projetoId === null) {
      this.relatorios.set([]);
      this.loading.set(false);
      return;
    }

    this.projetoService.getProjetoPorId(projetoId).subscribe({
      next: (atualizado) => {
        this.projetoSelecionadoService.selecionar(atualizado);
        this.getRelatorios();
        if (atualizado.statusExecucao === 'Executando') {
          this.executando.set(true);
          this.iniciarPolling(Date.now(), true);
        }
      },
      error: () => this.getRelatorios(),
    });
  }

  private iniciarPolling(startedAt: number, retomar: boolean) {
    this.pararPolling();
    this.pollSub = interval(5000).subscribe(() => this.verificarProgresso(startedAt, retomar));
    this.pollTimeout = setTimeout(
      () => {
        this.pararPolling();
        this.executando.set(false);
        this.messageService.add({
          severity: 'warn',
          summary: 'Tempo esgotado',
          detail: 'A análise ainda não terminou. Atualize a lista mais tarde.',
        });
      },
      10 * 60 * 1000,
    );
  }

  private verificarProgresso(startedAt: number, retomar: boolean) {
    const projeto = this.projeto();
    if (!projeto) {
      return;
    }

    forkJoin({
      projeto: this.projetoService.getProjetoPorId(projeto.id),
      relatorios: this.relatoriosService.getRelatoriosPorProjeto(projeto.id),
    }).subscribe({
      next: ({ projeto: atualizado, relatorios }) => {
        this.projetoSelecionadoService.selecionar(atualizado);
        this.relatorios.set(relatorios);

        if (atualizado.statusExecucao === 'Falhou') {
          this.pararPolling();
          this.executando.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Falha na análise',
            detail: atualizado.mensagemErroExecucao ?? 'A avaliação não pôde ser concluída.',
          });
          return;
        }

        const novoRelatorio = relatorios.some(
          (relatorio) => new Date(relatorio.dataHoraExecucao).getTime() >= startedAt - 2000,
        );

        if (atualizado.statusExecucao === 'Idle' && (novoRelatorio || retomar)) {
          this.pararPolling();
          this.executando.set(false);
          if (novoRelatorio) {
            this.messageService.add({
              severity: 'success',
              summary: 'Análise concluída',
              detail: 'O relatório foi gerado e já está na lista.',
            });
          }
        }
      },
    });
  }

  private pararPolling() {
    this.pollSub?.unsubscribe();
    this.pollSub = undefined;
    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout);
      this.pollTimeout = undefined;
    }
  }
}
