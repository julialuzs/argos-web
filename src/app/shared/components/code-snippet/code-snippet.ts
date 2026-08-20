import { Component, computed, Input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { UpperCasePipe } from '@angular/common';

import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-typescript';

export type CodeSnippetLanguage = 'json' | 'yml' | 'bash' | 'cmd' | 'html' | 'css';

@Component({
  selector: 'app-code-snippet',
  imports: [ButtonModule, UpperCasePipe],
  templateUrl: './code-snippet.html',
  styleUrl: './code-snippet.css',
})
export class CodeSnippet {
  @Input() code = '';
  @Input() language: CodeSnippetLanguage = 'json';
  @Input() showHeader = true;

  readonly copiado = signal(false);

  readonly highlightedCode = computed(() => {
    const grammar = Prism.languages[this.language];

    if (!this.code || !grammar) {
      return this.escapeHtml(this.code);
    }

    return Prism.highlight(this.code, grammar, this.language);
  });

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.code);
    this.copiado.set(true);
    setTimeout(() => this.copiado.set(false), 2000);
  }

  private escapeHtml(value: string): string {
    return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }
}
