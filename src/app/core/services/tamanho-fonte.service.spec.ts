import { TestBed } from '@angular/core/testing';
import {
  CLASSES_TAMANHO_FONTE,
  TamanhoFonteService,
} from './tamanho-fonte.service';

describe('TamanhoFonteService', () => {
  const classes = Object.values(CLASSES_TAMANHO_FONTE).filter(Boolean);

  function limpar(): void {
    localStorage.clear();
    document.documentElement.classList.remove(...classes);
  }

  beforeEach(() => {
    limpar();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    limpar();
  });

  it('deve iniciar no tamanho padrão', () => {
    const service = TestBed.inject(TamanhoFonteService);

    expect(service.tamanhoFonte()).toBe('padrao');
    expect(document.documentElement.classList.contains('argos-fonte-grande')).toBe(false);
    expect(document.documentElement.classList.contains('argos-fonte-extra')).toBe(false);
  });

  it('deve aplicar a classe no html e persistir a escolha', () => {
    const service = TestBed.inject(TamanhoFonteService);

    service.definir('grande');
    TestBed.flushEffects();

    expect(service.tamanhoFonte()).toBe('grande');
    expect(document.documentElement.classList.contains('argos-fonte-grande')).toBe(true);
    expect(localStorage.getItem('tamanhoFonte')).toBe('grande');
  });

  it('deve trocar a classe ao mudar para extra e ao voltar ao padrão', () => {
    const service = TestBed.inject(TamanhoFonteService);

    service.definir('extra');
    TestBed.flushEffects();
    expect(document.documentElement.classList.contains('argos-fonte-extra')).toBe(true);
    expect(document.documentElement.classList.contains('argos-fonte-grande')).toBe(false);

    service.definir('padrao');
    TestBed.flushEffects();
    expect(document.documentElement.classList.contains('argos-fonte-extra')).toBe(false);
    expect(document.documentElement.classList.contains('argos-fonte-grande')).toBe(false);
    expect(localStorage.getItem('tamanhoFonte')).toBe('padrao');
  });

  it('deve restaurar o tamanho salvo no localStorage', () => {
    localStorage.setItem('tamanhoFonte', 'extra');

    const service = TestBed.inject(TamanhoFonteService);
    TestBed.flushEffects();

    expect(service.tamanhoFonte()).toBe('extra');
    expect(document.documentElement.classList.contains('argos-fonte-extra')).toBe(true);
  });

  it('deve expor a escala correspondente ao tamanho escolhido', () => {
    const service = TestBed.inject(TamanhoFonteService);

    expect(service.escala()).toBe(1);
    service.definir('grande');
    expect(service.escala()).toBe(1.25);
    service.definir('extra');
    expect(service.escala()).toBe(1.5);
  });
});
