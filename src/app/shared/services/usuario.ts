import { Projeto } from '@shared/models/projeto';

export type UsuarioRequest = {
  nome: string;
  email: string;
  senha: string;
};

export type UsuarioResponse = {
  id: string;
  nome: string;
  email: string;
  projetos: Projeto[];
  projetoSelecionado: Projeto;
};

export type UsuarioLogado = {
  id: string;
  nome: string;
  email: string;
  projetos: Projeto[];
  projetoSelecionado: Projeto;
};
