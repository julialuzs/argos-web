import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppBreadcrumb, montarItensBreadcrumb } from './breadcrumb';

describe('montarItensBreadcrumb', () => {
  it('deve montar a trilha de Projetos', () => {
    expect(montarItensBreadcrumb('/projetos')).toEqual([{ label: 'Projetos', current: true }]);
  });

  it('deve montar a trilha de Tutorial', () => {
    expect(montarItensBreadcrumb('/tutorial')).toEqual([{ label: 'Tutorial', current: true }]);
  });

  it('deve montar a trilha de Relatórios', () => {
    expect(montarItensBreadcrumb('/abc-guid/relatorios')).toEqual([
      { label: 'Relatórios', current: true },
    ]);
  });

  it('deve montar a trilha do detalhe do relatório com link para a lista', () => {
    expect(montarItensBreadcrumb('/abc-guid/relatorios/42')).toEqual([
      { label: 'Relatórios', routerLink: ['/', 'abc-guid', 'relatorios'] },
      { label: 'Relatório de Acessibilidade', current: true },
    ]);
  });

  it('deve montar a trilha de Dashboard', () => {
    expect(montarItensBreadcrumb('/abc-guid/dashboard')).toEqual([
      { label: 'Dashboard', current: true },
    ]);
  });

  it('deve ignorar query string e fragmento', () => {
    expect(montarItensBreadcrumb('/projetos?tab=ativos#topo')).toEqual([
      { label: 'Projetos', current: true },
    ]);
  });

  it('deve retornar lista vazia para rota desconhecida', () => {
    expect(montarItensBreadcrumb('/')).toEqual([]);
  });
});

describe('AppBreadcrumb', () => {
  let fixture: ComponentFixture<AppBreadcrumb>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppBreadcrumb],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppBreadcrumb);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
