import { Projeto } from './projeto';

export type Apontamento = {
  id: string;
  titulo: string;
  severidade: string;
  tipo: 'erro' | 'aviso';
  fonte: string;
  descricao: string;
  criteriosEmag: string[];
  recomendacao: string;
  urlAjuda?: string;
  referenciasWcag: string[];
  elementoHtml?: string;
  quantidadeElementos?: number;
};

export type ResultadoAuditoria = {
  url: string;
  caminho: string;
  pontuacao: number;
  problemasCriticos: number;
  criteriosEmagMapeados: string[];
  apontamentos: Apontamento[];
};

export type Relatorio = {
  id?: number;
  projetoId: number;
  projeto?: Projeto;
  dataHoraExecucao: Date;
  pontuacao: number;
  tradutorLibrasIdentificado: boolean;
  quantidadeErros: number;
  quantidadeAvisos: number;
};

export type RelatorioDetalhe = Relatorio & {
  handTalkIdentificado: boolean;
  rotasAuditadas: number;
  fluxosAuditados: number;
  resultados: ResultadoAuditoria[];
};
