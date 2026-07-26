import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetoForm } from './projeto-form';

describe('ProjetoForm', () => {
  let component: ProjetoForm;
  let fixture: ComponentFixture<ProjetoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjetoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
