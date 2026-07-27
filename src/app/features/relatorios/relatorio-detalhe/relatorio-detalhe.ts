import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

const primeNgModules = [ButtonModule, DividerModule];

@Component({
  selector: 'app-relatorio-detalhe',
  imports: [...primeNgModules],
  templateUrl: './relatorio-detalhe.html',
  styleUrl: './relatorio-detalhe.css',
})
export class RelatorioDetalhe {}
