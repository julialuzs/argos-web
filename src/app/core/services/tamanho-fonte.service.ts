import { DOCUMENT, Service, computed, effect, inject, signal } from '@angular/core';

const STORAGE_KEY = 'tamanhoFonte';

export type TamanhoFonte = 'padrao' | 'grande' | 'extra';

export const CLASSES_TAMANHO_FONTE: Record<TamanhoFonte, string> = {
  padrao: '',
  grande: 'argos-fonte-grande',
  extra: 'argos-fonte-extra',
};

export const ESCALAS_TAMANHO_FONTE: Record<TamanhoFonte, number> = {
  padrao: 1,
  grande: 1.25,
  extra: 1.5,
};

export const OPCOES_TAMANHO_FONTE: {
  valor: TamanhoFonte;
  rotulo: string;
  preview: string;
}[] = [
  { valor: 'padrao', rotulo: 'Padrão', preview: '16px' },
  { valor: 'grande', rotulo: 'Grande', preview: '20px' },
  { valor: 'extra', rotulo: 'Extra', preview: '24px' },
];

const CLASSES_APLICAVEIS = Object.values(CLASSES_TAMANHO_FONTE).filter(Boolean);

function isTamanhoFonte(valor: string | null): valor is TamanhoFonte {
  return valor === 'padrao' || valor === 'grande' || valor === 'extra';
}

@Service()
export class TamanhoFonteService {
  private readonly document = inject(DOCUMENT);
  private readonly tamanho = signal<TamanhoFonte>(this.loadFromStorage());

  readonly tamanhoFonte = this.tamanho.asReadonly();
  readonly escala = computed(() => ESCALAS_TAMANHO_FONTE[this.tamanho()]);
  readonly opcoes = OPCOES_TAMANHO_FONTE;

  constructor() {
    effect(() => {
      const valor = this.tamanho();
      const root = this.document.documentElement;

      for (const classe of CLASSES_APLICAVEIS) {
        root.classList.remove(classe);
      }

      const classe = CLASSES_TAMANHO_FONTE[valor];
      if (classe) {
        root.classList.add(classe);
      }

      localStorage.setItem(STORAGE_KEY, valor);
    });
  }

  definir(tamanho: TamanhoFonte): void {
    if (!isTamanhoFonte(tamanho)) {
      return;
    }

    this.tamanho.set(tamanho);
  }

  private loadFromStorage(): TamanhoFonte {
    const salvo = localStorage.getItem(STORAGE_KEY);
    return isTamanhoFonte(salvo) ? salvo : 'padrao';
  }
}
