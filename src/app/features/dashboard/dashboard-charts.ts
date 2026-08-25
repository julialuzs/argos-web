import {
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
  ApexTheme,
} from 'ng-apexcharts';
import { DashboardEmag, DashboardRota, DashboardSeveridade, DashboardSerieExecucao } from './dashboard.model';

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
  theme?: ApexTheme;
  colors?: string[];
  labels?: string[];
};

const FONT_FAMILY = 'Inter Variable, Inter, "Segoe UI Symbol", "Segoe UI", sans-serif';

const CORES_SEVERIDADE: Record<string, string> = {
  Crítico: '#F43F5E',
  Grave: '#F97316',
  Moderado: '#F59E0B',
  Baixo: '#0EA5E9',
  Informação: '#64748B',
};

function titulo(text: string): ApexTitleSubtitle {
  return {
    text,
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: 500,
    },
  };
}

function chartBase(type: ApexChart['type'], height = 350): ApexChart {
  return {
    type,
    height,
    width: '100%',
    fontFamily: FONT_FAMILY,
    background: 'transparent',
    toolbar: { show: false },
    zoom: { enabled: false },
  };
}

function eixosCategoria(categorias: string[]): { xaxis: ApexXAxis; yaxis: ApexYAxis } {
  return {
    xaxis: {
      categories: categorias,
      labels: {
        style: { fontSize: '13px' },
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: '13px' },
      },
    },
  };
}

export function formatarCategoria(data: string, todas: string[]): string {
  const atual = new Date(data);
  const dia = atual.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const mesmoDia = todas.filter((item) => new Date(item).toDateString() === atual.toDateString()).length > 1;

  if (!mesmoDia) {
    return dia;
  }

  const hora = atual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dia} ${hora}`;
}

function corPorPontuacao(pontuacao: number): string {
  if (pontuacao >= 90) {
    return '#22C55E';
  }
  if (pontuacao >= 70) {
    return '#F59E0B';
  }
  return '#F43F5E';
}

export function criarOpcoesPontuacao(series: DashboardSerieExecucao[]): Partial<ChartOptions> {
  const datas = series.map((item) => item.dataHoraExecucao);
  const categorias = datas.map((data) => formatarCategoria(data, datas));

  return {
    title: titulo('Pontuação ao longo do tempo'),
    series: [{ name: 'Pontuação', data: series.map((item) => item.pontuacao) }],
    chart: chartBase('area'),
    colors: ['#8B5CF6'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    markers: { size: 4 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    ...eixosCategoria(categorias),
    yaxis: {
      min: 0,
      max: 100,
      title: {
        text: 'Pontuação',
        style: { fontSize: '14px', fontWeight: 500 },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} de 100`,
      },
    },
  };
}

export function criarOpcoesErrosAvisos(series: DashboardSerieExecucao[]): Partial<ChartOptions> {
  const datas = series.map((item) => item.dataHoraExecucao);
  const categorias = datas.map((data) => formatarCategoria(data, datas));

  return {
    title: titulo('Erros e avisos por execução'),
    series: [
      { name: 'Erros', data: series.map((item) => item.quantidadeErros) },
      { name: 'Avisos', data: series.map((item) => item.quantidadeAvisos) },
    ],
    chart: chartBase('bar'),
    colors: ['#F43F5E', '#F59E0B'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    ...eixosCategoria(categorias),
    yaxis: {
      min: 0,
      title: {
        text: 'Quantidade',
        style: { fontSize: '14px', fontWeight: 500 },
      },
    },
    fill: { opacity: 1 },
    legend: { position: 'bottom' },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
}

export function criarOpcoesSeveridade(achados: DashboardSeveridade[]): Partial<ChartOptions> {
  const comValor = achados.filter((item) => item.quantidade > 0);

  return {
    title: titulo('Achados por severidade'),
    series: comValor.map((item) => item.quantidade),
    labels: comValor.map((item) => item.severidade),
    colors: comValor.map((item) => CORES_SEVERIDADE[item.severidade] ?? '#94A3B8'),
    chart: chartBase('donut'),
    plotOptions: {
      pie: {
        borderRadius: 8,
        donut: {
          size: '68%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Achados',
              formatter: () => `${comValor.reduce((acc, item) => acc + item.quantidade, 0)}`,
            },
          },
        },
      },
    },
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    legend: { position: 'bottom' },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
}

export function criarOpcoesRotas(rotas: DashboardRota[]): Partial<ChartOptions> {
  const categorias = rotas.map((item) => item.rota);

  return {
    title: titulo('Pontuação por rota'),
    series: [{ name: 'Pontuação', data: rotas.map((item) => item.pontuacao) }],
    chart: { ...chartBase('bar'), height: Math.max(280, rotas.length * 56) },
    colors: rotas.map((item) => corPorPontuacao(item.pontuacao)),
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 5,
        borderRadiusApplication: 'end',
        distributed: true,
        barHeight: '55%',
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}`,
    },
    legend: { show: false },
    ...eixosCategoria(categorias),
    xaxis: {
      categories: categorias,
      max: 100,
      labels: {
        style: { fontSize: '13px' },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number, opts?: { dataPointIndex?: number }) => {
          const rota = rotas[opts?.dataPointIndex ?? -1];
          if (!rota) {
            return `${val} de 100`;
          }
          return `${val} de 100 · ${rota.quantidadeApontamentos} apontamentos`;
        },
      },
    },
  };
}

export function criarOpcoesEmag(criterios: DashboardEmag[]): Partial<ChartOptions> {
  const categorias = criterios.map((item) => item.criterio);

  return {
    title: titulo('Critérios eMAG mais violados'),
    series: [{ name: 'Ocorrências', data: criterios.map((item) => item.quantidade) }],
    chart: { ...chartBase('bar'), height: Math.max(280, criterios.length * 48) },
    colors: ['#7C3AED'],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 5,
        borderRadiusApplication: 'end',
        barHeight: '55%',
      },
    },
    dataLabels: { enabled: false },
    ...eixosCategoria(categorias),
    xaxis: {
      categories: categorias,
      labels: {
        style: { fontSize: '13px' },
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: '13px' },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
}
