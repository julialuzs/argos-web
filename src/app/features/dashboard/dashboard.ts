import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexStroke,
  ApexFill,
  ApexLegend,
  ApexTooltip,
  ApexMarkers,
  ApexPlotOptions,
  ApexResponsive,
  ApexGrid,
  ApexAnnotations,
  ApexStates,
  ApexTheme,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { RelatoriosService } from '@features/relatorios/relatorios.service';
import { ProjetoSelecionadoService } from '@core/services/projeto-selecionado.service';
import { Relatorio } from '@shared/models/relatorio';
import { Refresh } from '@primeicons/angular/refresh';

export type ChartOptions = {
  series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
  title?: ApexTitleSubtitle;
  subtitle?: ApexTitleSubtitle;
  dataLabels?: ApexDataLabels;
  stroke?: ApexStroke;
  fill?: ApexFill;
  legend?: ApexLegend;
  tooltip?: ApexTooltip;
  markers?: ApexMarkers;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  grid?: ApexGrid;
  annotations?: ApexAnnotations;
  states?: ApexStates;
  theme?: ApexTheme;
  colors?: string[];
  labels?: any;
};

export const BAR_CHART_OPTIONS: Partial<ChartOptions> = {
  title: {
    text: 'Erros/Avisos/Pontuação por Data',
    align: 'left',
  },
  series: [
    {
      name: 'Erros',
      data: [],
    },
    {
      name: 'Avisos',
      data: [],
    },
    {
      name: 'Pontuação',
      data: [],
    },
  ],
  chart: {
    type: 'bar',
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  xaxis: {
    categories: [],
  },
  yaxis: {
    title: {
      text: 'Quantidade',
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: (val: any) => `${val}`,
    },
  },
};

export const PIE_CHART_OPTIONS: Partial<ChartOptions> = {
  series: [30, 25, 18, 13, 20],
  chart: {
    type: 'donut',
    width: 420,
  },
  labels: ['Crítico', 'Grave', 'Moderado', 'Baixa', 'Informativa'],
  colors: ['#F43F5E', '#F59E0B', '#14B8A6', '#0EA5E9', '#0EA5E9'],
  plotOptions: {
    pie: {
      // Round the corners of every slice (px)
      borderRadius: 12,
      // Leave a gap between adjacent slices (px)
      spacing: 5,
      donut: {
        size: '68%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Orders',
          },
        },
      },
    },
  },
  stroke: {
    width: 0,
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    position: 'bottom',
  },
  title: {
    text: 'Achados por Severidade',
    align: 'left',
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 320,
        },
      },
    },
  ],
};

@Component({
  selector: 'app-dashboard',
  imports: [DividerModule, ButtonModule, Refresh, NgApexchartsModule],
  providers: [MessageService],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  private relatoriosService = inject(RelatoriosService);
  private projetoSelecionadoService = inject(ProjetoSelecionadoService);
  private messageService = inject(MessageService);

  projeto = computed(() => this.projetoSelecionadoService.projetoSelecionado());

  public barChartOptions = signal<Partial<ChartOptions>>(BAR_CHART_OPTIONS);
  public chartOptions = signal<Partial<ChartOptions>>(PIE_CHART_OPTIONS);

  ngOnInit() {
    if (this.projeto() !== null) {
      this.getDadosDashboard();
    }
  }

  // TODO: alterar para usar endpoint próprio do dashboard
  getDadosDashboard() {
    const projeto = this.projeto();
    if (!projeto) {
      return;
    }

    this.relatoriosService.getRelatoriosPorProjeto(projeto.id).subscribe({
      next: (relatorios) => {
        this.atualizarBarChart(relatorios);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao carregar o dashboard',
          detail: 'Erro ao carregar os dados. Tente novamente mais tarde.',
        });
      },
    });
  }

  private atualizarBarChart(relatorios: Relatorio[]) {
    const categorias = relatorios.map((r) => this.formatarDataExecucao(r.dataHoraExecucao));
    const erros = relatorios.map((r) => r.quantidadeErros);
    const avisos = relatorios.map((r) => r.quantidadeAvisos);
    const pontuacoes = relatorios.map((r) => r.pontuacao);

    this.barChartOptions.set({
      ...this.barChartOptions(),
      series: [
        { name: 'Erros', data: erros },
        { name: 'Avisos', data: avisos },
        { name: 'Pontuação', data: pontuacoes },
      ],
      xaxis: {
        ...this.barChartOptions().xaxis,
        categories: categorias,
      },
    });
  }

  private formatarDataExecucao(data: Date | string): string {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // const dataFormatada = new Date(data).toLocaleDateString('pt-BR', {
    //       day: 'numeric',
    //       month: 'short',
    //     });

    //     // Ex.: "2 de abr." → "2 abr."
    //     return dataFormatada.replace(' de ', ' ');
  }
}
