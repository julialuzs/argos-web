import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router'; 
import { Book } from '@primeicons/angular/book';
import { Bolt } from '@primeicons/angular/bolt';
import { ChartLine } from '@primeicons/angular/chart-line';
import { ExclamationCircle } from '@primeicons/angular/exclamation-circle';
import { InfoCircle } from '@primeicons/angular/info-circle';
import { Receipt } from '@primeicons/angular/receipt';
import { Search } from '@primeicons/angular/search';
import { Sparkles } from '@primeicons/angular/sparkles';
import { TimesCircle } from '@primeicons/angular/times-circle';
import { Trophy } from '@primeicons/angular/trophy';
import { Users } from '@primeicons/angular/users'; 
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

const icons = [
  Users,
  Search,
  Book,
  Sparkles,
  Bolt,
  Receipt,
  ChartLine,
  Trophy,
  TimesCircle,
  ExclamationCircle,
  InfoCircle,
];

@Component({
  selector: 'app-landing',
  imports: [RouterLink, ButtonModule, CardModule, ...icons],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  private readonly document = inject(DOCUMENT);

  irParaSecao(event: Event, id: string): void {
    event.preventDefault();
    const secao = this.document.getElementById(id);
    secao?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (secao instanceof HTMLElement) {
      secao.focus({ preventScroll: true });
    }
  }
}
