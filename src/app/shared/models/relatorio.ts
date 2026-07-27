import { Projeto } from './projeto';

export type Relatorio = {
  projetoId: number;
  projeto: Projeto;
  dataHoraExecucao: Date;
  pontuacao: number;
  json: string;
  tradutorLibrasIdentificado: boolean;
  quantidadeErros: number;
  quantidadeAvisos: number;
};
