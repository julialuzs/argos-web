import { Component, computed, effect, inject, input, NgZone, signal, untracked } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Refresh } from '@primeicons/angular/refresh';
import { ChartBar } from '@primeicons/angular/chart-bar';
import { ProjetoSelecionadoService } from '@core/services/projeto-selecionado.service';
import { TemaService } from '@core/services/tema.service';
import { TamanhoFonteService } from '@core/services/tamanho-fonte.service';
import { ProjetoService } from '@features/projetos/projeto.service';
import { DashboardService } from './dashboard.service';
import { DashboardDados, DashboardResumo } from './dashboard.model';
import {
  ChartOptions,
  criarOpcoesEmag,
  criarOpcoesErrosAvisos,
  criarOpcoesPontuacao,
  criarOpcoesRotas,
  criarOpcoesSeveridade,
} from './dashboard-charts';

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe,
    DividerModule,
    CardModule,
    ButtonModule,
    Refresh,
    ChartBar,
    NgApexchartsModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private dashboardService = inject(DashboardService);
  private temaService = inject(TemaService);
  private tamanhoFonteService = inject(TamanhoFonteService);
  private projetoSelecionadoService = inject(ProjetoSelecionadoService);
  private projetoService = inject(ProjetoService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  projetoGuid = input.required<string>();
  projeto = computed(() => this.projetoSelecionadoService.projetoSelecionado());
  dashboard = signal<DashboardDados | null>(null);
  loading = signal(false);
  private readonly sincronizarProjeto = effect(() => {
    const guid = this.projetoGuid();
    untracked(() => this.aoAlterarProjeto(guid));
  });
  private readonly sincronizarGraficos = effect(() => {
    const dados = this.dashboard();
    const escala = this.tamanhoFonteService.escala();
    untracked(() => {
      if (!dados) {
        return;
      }
      this.atualizarGraficos(dados, escala);
    });
  });

  lineChartOptions = signal<Partial<ChartOptions>>(criarOpcoesPontuacao([]));
  barChartOptions = signal<Partial<ChartOptions>>(criarOpcoesErrosAvisos([]));
  pieChartOptions = signal<Partial<ChartOptions>>(criarOpcoesSeveridade([]));
  routeChartOptions = signal<Partial<ChartOptions>>(criarOpcoesRotas([]));
  emagChartOptions = signal<Partial<ChartOptions>>(criarOpcoesEmag([]));

  modoTema = computed(() => (this.temaService.temaEscuro() ? 'dark' : 'light'));
  resumo = computed(() => this.dashboard()?.resumo ?? null);
  temSeries = computed(() => (this.dashboard()?.series.length ?? 0) > 0);
  temSeveridade = computed(
    () => this.dashboard()?.achadosPorSeveridade.some((item) => item.quantidade > 0) ?? false,
  );
  temRotas = computed(() => (this.dashboard()?.pontuacaoPorRota.length ?? 0) > 0);
  temEmag = computed(() => (this.dashboard()?.criteriosEmag.length ?? 0) > 0);
  quantidadeExecucoes = computed(() => this.dashboard()?.series.length ?? 0);
  resumoAcessivel = computed(() => this.montarResumoAcessivel(this.resumo(), this.temSeries()));

  getDadosDashboard() {
    const guid = this.projetoGuid();
    if (!guid) {
      return;
    }

    this.loading.set(true);
    this.dashboardService.getDashboard(guid).subscribe({
      next: (dados) => {
        this.dashboard.set(dados);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao carregar o dashboard',
          detail: 'Erro ao carregar os dados. Tente novamente mais tarde.',
        });
      },
    });
  }

  irParaRelatorios() {
    const projeto = this.projeto();
    if (!projeto) {
      return;
    }
    this.router.navigate([projeto.guid, 'relatorios']);
  }

  abrirRelatorio(relatorioId: number, event?: MouseEvent) {
    const projeto = this.projeto();
    if (!projeto || !relatorioId) {
      return;
    }

    const url = this.router.serializeUrl(
      this.router.createUrlTree([projeto.guid, 'relatorios', relatorioId]),
    );

    this.ngZone.run(() => {
      if (event?.ctrlKey || event?.metaKey) {
        window.open(url, '_blank', 'noopener');
        return;
      }
      void this.router.navigateByUrl(url);
    });
  }

  irParaProjetos() {
    this.router.navigate(['/projetos']);
  }

  getColor(pontuacao: number) {
    if (pontuacao >= 90) {
      return 'green';
    }
    if (pontuacao >= 70) {
      return 'orange';
    }
    return 'red';
  }

  formatarVariacao(variacao: number | null): string {
    if (variacao === null) {
      return 'Primeira execução do projeto.';
    }
    if (variacao === 0) {
      return 'Pontuação igual à da execução anterior.';
    }
    const sinal = variacao > 0 ? '+' : '';
    return `Variação em relação à execução anterior: ${sinal}${variacao} ponto(s).`;
  }

  private aoAlterarProjeto(guidProjeto: string) {
    if (!guidProjeto) {
      this.dashboard.set(null);
      return;
    }

    if (this.projetoSelecionadoService.projetoSelecionado()?.guid !== guidProjeto) {
      this.projetoService.getProjetoPorGuid(guidProjeto).subscribe({
        next: (projeto) => this.projetoSelecionadoService.selecionar(projeto),
      });
    }

    this.getDadosDashboard();
  }

  private atualizarGraficos(dados: DashboardDados, escala: number) {
    const aoClicarExecucao = (indice: number, event: MouseEvent) => {
      const relatorioId = dados.series[indice]?.relatorioId;
      if (relatorioId) {
        this.abrirRelatorio(relatorioId, event);
      }
    };
    const ultimoRelatorioId = dados.series.at(-1)?.relatorioId;
    const aoClicarUltimaExecucao = (_indice: number, event: MouseEvent) => {
      if (ultimoRelatorioId) {
        this.abrirRelatorio(ultimoRelatorioId, event);
      }
    };

    this.lineChartOptions.set(criarOpcoesPontuacao(dados.series, escala, aoClicarExecucao));
    this.barChartOptions.set(criarOpcoesErrosAvisos(dados.series, escala, aoClicarExecucao));
    this.pieChartOptions.set(
      criarOpcoesSeveridade(dados.achadosPorSeveridade, escala, aoClicarUltimaExecucao),
    );
    this.routeChartOptions.set(
      criarOpcoesRotas(dados.pontuacaoPorRota, escala, aoClicarUltimaExecucao),
    );
    this.emagChartOptions.set(criarOpcoesEmag(dados.criteriosEmag, escala, aoClicarUltimaExecucao));
  }

  private montarResumoAcessivel(resumo: DashboardResumo | null, temSeries: boolean): string {
    if (!temSeries || !resumo) {
      return 'Nenhuma auditoria disponível para este projeto.';
    }

    const variacao = this.formatarVariacao(resumo.variacaoPontuacao);
    return (
      `Seção última execução: pontuação ${resumo.pontuacao} de 100, com ${resumo.quantidadeErros} erros e ` +
      `${resumo.quantidadeAvisos} avisos. ${variacao} ` +
      `Seção evolução: comparativo das últimas ${this.quantidadeExecucoes()} execuções.`
    );
  }
}
