import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { RelatoriosService } from './relatorios.service';
import { ProjetoSelecionadoService } from '@core/services/projeto-selecionado.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { Refresh } from '@primeicons/angular/refresh';
import { Receipt } from '@primeicons/angular/receipt';
import { Router } from '@angular/router';
import { ChevronRight } from '@primeicons/angular/chevron-right';

const primeNgModules = [TableModule, DividerModule, TagModule, ButtonModule, MessageModule];
const icons = [Refresh, Receipt, ChevronRight];

@Component({
  selector: 'app-relatorios',
  imports: [DatePipe, ...icons, ...primeNgModules],
  providers: [MessageService],
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.css',
})
export class Relatorios implements OnInit {
  private projetoSelecionadoService = inject(ProjetoSelecionadoService);
  private relatoriosService = inject(RelatoriosService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  relatorios = signal<unknown[]>([]);
  projeto = computed(() => this.projetoSelecionadoService.projetoSelecionado());
  loading = signal(false);

  ngOnInit() {
    if (this.projeto() !== null) {
      this.getRelatorios();
    }
  }

  getRelatorios() {
    this.loading.set(true);
    this.relatoriosService.getRelatoriosPorProjeto(this.projeto()!.id).subscribe({
      next: (relatorios) => {
        this.relatorios.set(relatorios);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao carregar os relatórios',
          detail: 'Erro ao carregar os relatórios. Tente novamente mais tarde.',
        });
      },
    });
  }

  irParaRelatorio(relatorioId: number) {
    this.router.navigate([this.projeto()!.id, 'relatorios', relatorioId]);
  }

  getSeverity(pontuacao: number) {
    if (pontuacao >= 90) {
      return 'success';
    }
    if (pontuacao >= 70) {
      return 'warn';
    }

    return 'danger';
  }
}
