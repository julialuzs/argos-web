import { Component, inject, input, numberAttribute, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RelatoriosService } from '../relatorios.service';
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
import { Trophy } from '@primeicons/angular/trophy';

const primeNgModules = [
  ButtonModule,
  BadgeModule,
  StyleClassModule,
  DividerModule,
  CardModule,
  AccordionModule,
  ChipModule,
];
const icons = [ChevronRight, Trophy];

@Component({
  selector: 'app-relatorio-detalhe',
  imports: [StatCard, CodeSnippet, TitleCasePipe, DatePipe, ...icons, ...primeNgModules],
  providers: [MessageService],
  templateUrl: './relatorio-detalhe.html',
  styleUrl: './relatorio-detalhe.css',
})
export class RelatorioDetalhe implements OnInit {
  private relatoriosService = inject(RelatoriosService);
  private messageService = inject(MessageService);

  relatorio = signal<RelatorioDetalheType | null>(null);
  relatorioId = input.required<number, unknown>({ transform: numberAttribute });
  projetoId = input.required<number, unknown>({ transform: numberAttribute });

  padraoAberto = signal<number>(0);

  ngOnInit() {
    this.relatoriosService.getRelatorioPorId(this.projetoId(), this.relatorioId()).subscribe({
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
