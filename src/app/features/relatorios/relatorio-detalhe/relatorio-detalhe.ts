import { Component, computed, inject, input, numberAttribute, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RelatoriosService } from '../relatorios.service';
import { ProjetoSelecionadoService } from '@core/services/projeto-selecionado.service';
import { ProjetoService } from '@features/projetos/projeto.service';
import { MessageService } from 'primeng/api';
import { RelatorioDetalhe as RelatorioDetalheType } from '@shared/models/relatorio';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { StatCard } from '@shared/components/stat-card/stat-card';
import { ChevronRight } from '@primeicons/angular/chevron-right';
import { StyleClassModule } from 'primeng/styleclass';
import { BadgeModule } from 'primeng/badge';
import { BadgeSeverity } from 'primeng/types/badge';
import { CodeSnippet } from '@shared/components/code-snippet/code-snippet';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { InfoCircle } from '@primeicons/angular/info-circle';

const primeNgModules = [
  ButtonModule,
  BadgeModule,
  StyleClassModule,
  DividerModule,
  CardModule,
  AccordionModule,
  ChipModule,
  TooltipModule,
];
const icons = [ChevronRight, InfoCircle];

@Component({
  selector: 'app-relatorio-detalhe',
  imports: [StatCard, CodeSnippet, TitleCasePipe, DatePipe, ...icons, ...primeNgModules],
  providers: [MessageService],
  templateUrl: './relatorio-detalhe.html',
  styleUrl: './relatorio-detalhe.css',
})
export class RelatorioDetalhe implements OnInit {
  private relatoriosService = inject(RelatoriosService);
  private projetoService = inject(ProjetoService);
  private projetoSelecionadoService = inject(ProjetoSelecionadoService);
  private messageService = inject(MessageService);

  relatorio = signal<RelatorioDetalheType | null>(null);
  relatorioId = input.required<number, unknown>({ transform: numberAttribute });
  projetoGuid = input.required<string>();

  tradutorLibrasIdentificado = computed(() => {
    return this.relatorio()?.vLibrasIdentificado ?? this.relatorio()?.handTalkIdentificado ?? false;
  });

  tradutorLibras = computed(() =>
    this.tradutorLibrasIdentificado() ? 'VLibras Identificado' : 'Hand Talk Identificado',
  );

  padraoAberto = signal<number>(0);
  readonly textoTooltipRelatorio =
    'Este relatório foi gerado pelo Argos, que intermediou a avaliação utilizando o motor axe-core e as APIs da W3C. A avaliação automatizada não substitui uma análise manual.';

  ngOnInit() {
    const guid = this.projetoGuid();
    if (this.projetoSelecionadoService.projetoSelecionado()?.guid !== guid) {
      this.projetoService.getProjetoPorGuid(guid).subscribe({
        next: (projeto) => this.projetoSelecionadoService.selecionar(projeto),
      });
    }

    this.relatoriosService.getRelatorioPorId(guid, this.relatorioId()).subscribe({
      next: (relatorio) => {
        this.relatorio.set(relatorio);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao carregar o relatório',
          detail: 'Erro ao carregar o relatório. Tente novamente mais tarde.',
        });
      },
    });
  }

  getCorSeveridade(severidade: string): BadgeSeverity {
    switch (severidade) {
      case 'Grave':
        return 'warn';
      case 'Crítico':
        return 'danger';
      case 'Moderado':
        return 'secondary';
      case 'Baixo':
        return 'info';
      default:
        return 'secondary';
    }
  }

  getColor(pontuacao: number) {
    if (pontuacao >= 90) {
      return 'green';
    }
    if (pontuacao >= 70) {
      return 'orange';
    }

    return 'red';
  }

  getIconTipo(tipo: string): string {
    switch (tipo) {
      case 'erro':
        return 'pi pi-times-circle';
      default:
        return 'pi pi-exclamation-circle';
    }
  }
}
