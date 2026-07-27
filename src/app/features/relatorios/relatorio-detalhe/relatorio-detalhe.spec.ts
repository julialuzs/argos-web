import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioDetalhe } from './relatorio-detalhe';

describe('RelatorioDetalhe', () => {
  let component: RelatorioDetalhe;
  let fixture: ComponentFixture<RelatorioDetalhe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioDetalhe],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatorioDetalhe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
