import { criarOpcoesEmag } from './dashboard-charts';

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
