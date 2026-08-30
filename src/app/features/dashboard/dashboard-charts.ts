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
import {
  DashboardEmag,
  DashboardRota,
  DashboardSeveridade,
  DashboardSerieExecucao,
} from './dashboard.model';

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

function converterParaPixels(base: number, escala: number): string {
  return `${Math.round(base * escala)}px`;
}

function titulo(text: string, escala: number): ApexTitleSubtitle {
  return {
    text,
    align: 'left',
    offsetY: 8,
    margin: Math.round(18 * escala),
    style: {
      fontSize: converterParaPixels(16, escala),
      fontWeight: 500,
    },
  };
}

function chartBase(type: ApexChart['type'], height = 350, escala = 1): ApexChart {
  return {
    type,
    height,
    width: '100%',
    fontFamily: FONT_FAMILY,
    background: 'transparent',
    toolbar: { show: false },
    zoom: { enabled: false },
    parentHeightOffset: Math.round(12 * escala),
  };
}

function eixosCategoria(
  categorias: string[],
  escala: number,
): { xaxis: ApexXAxis; yaxis: ApexYAxis } {
  return {
    xaxis: {
      categories: categorias,
      labels: {
        style: { fontSize: converterParaPixels(13, escala) },
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: converterParaPixels(13, escala) },
      },
    },
  };
}

export function formatarCategoria(data: string, todas: string[]): string {
  const atual = new Date(data);
  const dia = atual.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const mesmoDia =
    todas.filter((item) => new Date(item).toDateString() === atual.toDateString()).length > 1;

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

export function criarOpcoesPontuacao(
  series: DashboardSerieExecucao[],
  escala = 1,
): Partial<ChartOptions> {
  const datas = series.map((item) => item.dataHoraExecucao);
  const categorias = datas.map((data) => formatarCategoria(data, datas));

  return {
    title: titulo('Pontuação ao longo do tempo', escala),
    series: [{ name: 'Pontuação', data: series.map((item) => item.pontuacao) }],
    chart: chartBase('area', 350, escala),
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
    ...eixosCategoria(categorias, escala),
    yaxis: {
      min: 0,
      max: 100,
      title: {
        text: 'Pontuação',
        style: { fontSize: converterParaPixels(14, escala), fontWeight: 500 },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} de 100`,
      },
    },
  };
}

export function criarOpcoesErrosAvisos(
  series: DashboardSerieExecucao[],
  escala = 1,
): Partial<ChartOptions> {
  const datas = series.map((item) => item.dataHoraExecucao);
  const categorias = datas.map((data) => formatarCategoria(data, datas));

  return {
    title: titulo('Erros e avisos por execução', escala),
    series: [
      { name: 'Erros', data: series.map((item) => item.quantidadeErros) },
      { name: 'Avisos', data: series.map((item) => item.quantidadeAvisos) },
    ],
    chart: chartBase('bar', 350, escala),
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
    ...eixosCategoria(categorias, escala),
    yaxis: {
      min: 0,
      title: {
        text: 'Quantidade',
        style: { fontSize: converterParaPixels(14, escala), fontWeight: 500 },
      },
    },
    fill: { opacity: 1 },
    legend: { position: 'bottom', fontSize: converterParaPixels(13, escala) },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
}

export function criarOpcoesSeveridade(
  achados: DashboardSeveridade[],
  escala = 1,
): Partial<ChartOptions> {
  const comValor = achados.filter((item) => item.quantidade > 0);

  return {
    title: titulo('Achados por severidade', escala),
    series: comValor.map((item) => item.quantidade),
    labels: comValor.map((item) => item.severidade),
    colors: comValor.map((item) => CORES_SEVERIDADE[item.severidade] ?? '#94A3B8'),
    chart: chartBase('donut', 350, escala),
    plotOptions: {
      pie: {
        borderRadius: 8,
        donut: {
          size: '68%',
          labels: {
            show: true,
            name: { fontSize: converterParaPixels(14, escala) },
            value: { fontSize: converterParaPixels(20, escala) },
            total: {
              show: true,
              label: 'Achados',
              fontSize: converterParaPixels(16, escala),
              formatter: () => `${comValor.reduce((acc, item) => acc + item.quantidade, 0)}`,
            },
          },
        },
      },
    },
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    legend: { position: 'bottom', fontSize: converterParaPixels(13, escala) },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
}

export function criarOpcoesRotas(rotas: DashboardRota[], escala = 1): Partial<ChartOptions> {
  const categorias = rotas.map((item) => item.rota);

  return {
    title: titulo('Pontuação por rota', escala),
    series: [{ name: 'Pontuação', data: rotas.map((item) => item.pontuacao) }],
    chart: { ...chartBase('bar', Math.max(280, rotas.length * Math.round(56 * escala)), escala) },
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
      style: { fontSize: converterParaPixels(12, escala) },
    },
    legend: { show: false },
    ...eixosCategoria(categorias, escala),
    xaxis: {
      categories: categorias,
      max: 100,
      labels: {
        style: { fontSize: converterParaPixels(13, escala) },
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

export function criarOpcoesEmag(criterios: DashboardEmag[], escala = 1): Partial<ChartOptions> {
  const categorias = criterios.map((item) => item.criterio);
  const ocorrencias = criterios.map((item) => item.quantidade);
  const { xaxis, yaxis } = eixosCategoria(categorias, escala);

  return {
    title: titulo('Critérios eMAG mais violados', escala),
    series: [{ name: 'Ocorrências', data: ocorrencias }],
    chart: {
      // altura = 48px por critério (ajustado pela fonte), com mínimo de 280px
      ...chartBase('bar', Math.max(280, criterios.length * Math.round(48 * escala)), escala),
    },
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
    xaxis: {
      ...xaxis,
      min: 0,
      // ocorrências são inteiras; sem stepSize o Apex gera 0.5 e arredonda (0, 1, 1, 2, 2…)
      stepSize: 1,
      decimalsInFloat: 0,
    },
    yaxis,
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
}
