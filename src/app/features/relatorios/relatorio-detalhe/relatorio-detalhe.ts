import { Component, inject, input, numberAttribute, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RelatoriosService } from '../relatorios.service';
import { MessageService } from 'primeng/api';
import { Relatorio } from '@shared/models/relatorio';
import { DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { StatCard } from '@shared/components/stat-card/stat-card';

const primeNgModules = [ButtonModule, DividerModule, CardModule];

@Component({
  selector: 'app-relatorio-detalhe',
  imports: [StatCard, DatePipe, ...primeNgModules],
  providers: [MessageService],
  templateUrl: './relatorio-detalhe.html',
  styleUrl: './relatorio-detalhe.css',
})
export class RelatorioDetalhe implements OnInit {
  private relatoriosService = inject(RelatoriosService);
  private messageService = inject(MessageService);

  relatorio = signal<Relatorio | null>(null);
  relatorioId = input.required<number, unknown>({ transform: numberAttribute });
  projetoId = input.required<number, unknown>({ transform: numberAttribute });

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

  getColor(pontuacao: number) {
    if (pontuacao >= 90) {
      return 'green';
    }
    if (pontuacao >= 70) {
      return 'orange';
    }

    return 'red';
  }
}
