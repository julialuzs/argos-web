import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Landing } from './landing';

describe('Landing', () => {
  let fixture: ComponentFixture<Landing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Landing],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Landing);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the product heading and why-accessibility section', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Acessibilidade contínua para o seu site');
    expect(text).toContain('Por que se preocupar com acessibilidade?');
    expect(text).toContain('Como começar');
  });

  it('should link to login and cadastro', () => {
    const hrefs = [...(fixture.nativeElement as HTMLElement).querySelectorAll('a')].map((anchor) =>
      anchor.getAttribute('href'),
    );

    expect(hrefs).toContain('/login');
    expect(hrefs).toContain('/cadastro');
  });

  it('should expose a skip link to the main content', () => {
    const skip = (fixture.nativeElement as HTMLElement).querySelector('a.skip-link');

    expect(skip?.getAttribute('href')).toBe('#conteudo');
    expect(skip?.textContent).toContain('Pular para o conteúdo');
  });
});
