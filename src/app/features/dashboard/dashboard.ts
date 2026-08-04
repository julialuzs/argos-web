import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

const primeNgModules = [DividerModule, ButtonModule];

@Component({
  selector: 'app-dashboard',
  imports: [...primeNgModules],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  getDadosDashboard() {}
}
