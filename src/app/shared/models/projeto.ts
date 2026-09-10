export type StatusExecucao = 'Idle' | 'Executando' | 'Falhou';

export type Projeto = {
  id: number;
  guid: string;
  nome: string;
  descricao: string | null;
  ultimaExecucao: Date;
  urlBase: string;
  rotas: string[];
  incluirW3c: boolean;
  statusExecucao: StatusExecucao;
  mensagemErroExecucao: string | null;
};
