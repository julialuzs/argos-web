import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CodeSnippet } from '@shared/components/code-snippet/code-snippet';
import { DividerModule } from 'primeng/divider';
import {
  ARGOS_CONFIG_SNIPPET,
  GITHUB_ACTIONS_SNIPPET,
  NPM_AUDIT_SNIPPET,
  NPM_INSTALL_SNIPPET,
} from './snippets';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { ProjetoSelecionadoService } from '@core/services/projeto-selecionado.service';
import { MessageService } from 'primeng/api';
import { Copy } from '@primeicons/angular/copy';
import { ChevronRight } from '@primeicons/angular/chevron-right';
import { CardModule } from 'primeng/card';

const primeNgModules = [DividerModule, ButtonModule, TagModule, TabsModule, CardModule];
const icons = [Copy, ChevronRight];

@Component({
  selector: 'app-tutorial',
  imports: [...primeNgModules, ...icons, CodeSnippet],
  templateUrl: './tutorial.html',
  styleUrl: './tutorial.css',
})
export class Tutorial {
  private readonly router = inject(Router);
  private readonly projetoSelecionadoService = inject(ProjetoSelecionadoService);
  private readonly messageService = inject(MessageService);

  readonly projeto = computed(() => this.projetoSelecionadoService.projetoSelecionado());

  readonly argosConfigSnippet = ARGOS_CONFIG_SNIPPET;
  readonly githubActionsSnippet = GITHUB_ACTIONS_SNIPPET;
  readonly npmInstallSnippet = NPM_INSTALL_SNIPPET;
  readonly npmAuditSnippet = NPM_AUDIT_SNIPPET;

  irParaProjetos() {
    this.router.navigate(['/projetos']);
  }

  irParaRelatorios() {
    const projeto = this.projeto();
    if (!projeto) {
      this.messageService.add({
        severity: 'info',
        summary: 'Selecione um projeto',
        detail: 'Escolha um projeto para abrir os relatórios.',
      });
      this.router.navigate(['/projetos']);
      return;
    }
    this.router.navigate([projeto.id, 'relatorios']);
  }

  copiarGuid() {
    const projeto = this.projeto();
    if (!projeto) {
      this.messageService.add({
        severity: 'info',
        summary: 'Selecione um projeto',
        detail: 'Escolha um projeto para copiar o GUID.',
      });
      this.router.navigate(['/projetos']);
      return;
    }

    navigator.clipboard.writeText(projeto.guid);
    this.messageService.add({
      severity: 'success',
      summary: 'GUID copiado',
      detail: `Identificador de ${projeto.nome} copiado para a área de transferência.`,
    });
  }
}
