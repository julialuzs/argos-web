import { Service, signal } from '@angular/core';
import { Projeto } from '@shared/models/projeto';

const STORAGE_KEY = 'projetoSelecionado';

@Service()
export class ProjetoSelecionadoService {
  private readonly projeto = signal<Projeto | null>(this.loadFromStorage());

  readonly projetoSelecionado = this.projeto.asReadonly();

  selecionar(projeto: Projeto): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projeto));
    this.projeto.set(projeto);
  }

  limpar(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.projeto.set(null);
  }

  private loadFromStorage(): Projeto | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
