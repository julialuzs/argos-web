import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeSnippet } from './code-snippet';

describe('CodeSnippet', () => {
  let component: CodeSnippet;
  let fixture: ComponentFixture<CodeSnippet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeSnippet],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeSnippet);
    component = fixture.componentInstance;
    fixture.componentRef.setInput(
      'code',
      `{
  "baseUrl": "http://localhost:4200"
}`,
    );
    fixture.componentRef.setInput('language', 'json');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep line breaks and highlight JSON tokens', () => {
    const codeEl = fixture.nativeElement.querySelector('code') as HTMLElement;
    expect(codeEl.textContent).toContain('\n');
    expect(codeEl.querySelector('.token')).not.toBeNull();
  });
});
