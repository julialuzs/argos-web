import { Component, computed, input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import * as Prism from 'prismjs';

import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-typescript';

export type CodeSnippetLanguage = 'json' | 'yml';

const PRISM_LANGUAGE: Record<CodeSnippetLanguage, string> = {
  json: 'json',
  yml: 'yaml',
};

@Component({
  selector: 'app-code-snippet',
  imports: [ButtonModule],
  templateUrl: './code-snippet.html',
  styleUrl: './code-snippet.css',
})
export class CodeSnippet {
  readonly code = input<string>('');
  readonly language = input<CodeSnippetLanguage>('json');

  readonly copiado = signal(false);

  readonly prismLanguage = computed(() => PRISM_LANGUAGE[this.language()]);

  readonly languageLabel = computed(() => {
    const language = this.prismLanguage();
    return language === 'typescript' ? 'TS' : language.toUpperCase();
  });

  readonly highlightedCode = computed(() => {
    const code = this.code();
    const language = this.prismLanguage();
    const grammar = Prism.languages[language];

    if (!code || !grammar) {
      return this.escapeHtml(code);
    }

    return Prism.highlight(code, grammar, language);
  });

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.code());
    this.copiado.set(true);
    setTimeout(() => this.copiado.set(false), 2000);
  }

  private escapeHtml(value: string): string {
    return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }
}
