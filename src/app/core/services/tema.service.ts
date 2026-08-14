import { DOCUMENT, Service, effect, inject, signal } from '@angular/core';

const STORAGE_KEY = 'temaEscuro';

/** Classe aplicada no elemento raiz, deve ser igual ao `darkModeSelector` do PrimeNG. */
export const DARK_MODE_CLASS = 'argos-dark';

@Service()
export class TemaService {
  private readonly document = inject(DOCUMENT);
  private readonly escuro = signal(this.loadFromStorage());

  readonly temaEscuro = this.escuro.asReadonly();

  constructor() {
    effect(() => {
      const escuro = this.escuro();
      this.document.documentElement.classList.toggle(DARK_MODE_CLASS, escuro);
      localStorage.setItem(STORAGE_KEY, String(escuro));
    });
  }

  alternar(): void {
    this.escuro.update((escuro) => !escuro);
  }

  private loadFromStorage(): boolean {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }
}
