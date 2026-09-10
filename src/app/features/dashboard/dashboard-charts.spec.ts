import { criarOpcoesEmag, criarOpcoesErrosAvisos } from './dashboard-charts';
import { DashboardSerieExecucao } from './dashboard.model';

describe('criarOpcoesEmag', () => {
  const criterios = [
    { criterio: '1.1', quantidade: 6 },
    { criterio: '1.3', quantidade: 3 },
    { criterio: '1.4', quantidade: 1 },
  ];

  it('configura o eixo de ocorrências com passos inteiros', () => {
    const opcoes = criarOpcoesEmag(criterios);

    expect(opcoes.xaxis?.min).toBe(0);
    expect(opcoes.xaxis?.stepSize).toBe(1);
    expect(opcoes.xaxis?.decimalsInFloat).toBe(0);
    expect(opcoes.xaxis?.categories).toEqual(['1.1', '1.3', '1.4']);
    expect(opcoes.series).toEqual([{ name: 'Ocorrências', data: [6, 3, 1] }]);
  });
});

describe('criarOpcoesErrosAvisos', () => {
  const series: DashboardSerieExecucao[] = [
    {
      relatorioId: 10,
      dataHoraExecucao: '2026-09-01T10:00:00',
      pontuacao: 80,
      quantidadeErros: 2,
      quantidadeAvisos: 4,
    },
    {
      relatorioId: 11,
      dataHoraExecucao: '2026-09-02T10:00:00',
      pontuacao: 85,
      quantidadeErros: 1,
      quantidadeAvisos: 3,
    },
  ];

  it('dispara o clique com o índice da execução', () => {
    const aoClicar = vi.fn();
    const opcoes = criarOpcoesErrosAvisos(series, 1, aoClicar);

    opcoes.chart?.events?.click?.(new MouseEvent('click'), undefined, {
      dataPointIndex: 1,
      seriesIndex: 0,
      w: { config: {}, globals: {} },
    });

    expect(aoClicar).toHaveBeenCalledWith(1, expect.any(MouseEvent));
  });
});
