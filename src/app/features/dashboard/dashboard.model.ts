export type DashboardSerieExecucao = {
  dataHoraExecucao: string;
  pontuacao: number;
  quantidadeErros: number;
  quantidadeAvisos: number;
};

export type DashboardResumo = {
  dataHoraExecucao: string;
  pontuacao: number;
  variacaoPontuacao: number | null;
  quantidadeErros: number;
  quantidadeAvisos: number;
  rotasAuditadas: number;
  tradutorLibrasIdentificado: boolean;
  handTalkIdentificado: boolean;
};

export type DashboardSeveridade = {
  severidade: string;
  quantidade: number;
};

export type DashboardRota = {
  rota: string;
  pontuacao: number;
  problemasCriticos: number;
  quantidadeApontamentos: number;
};

export type DashboardEmag = {
  criterio: string;
  quantidade: number;
};

export type DashboardDados = {
  resumo: DashboardResumo | null;
  series: DashboardSerieExecucao[];
  achadosPorSeveridade: DashboardSeveridade[];
  pontuacaoPorRota: DashboardRota[];
  criteriosEmag: DashboardEmag[];
};
