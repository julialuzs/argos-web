import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TimesCircle } from '@primeicons/angular/times-circle';
import { ExclamationCircle } from '@primeicons/angular/exclamation-circle';
import { CheckCircle } from '@primeicons/angular/check-circle';
import { Trophy } from '@primeicons/angular/trophy';

export type iconTypes = 'error' | 'warning' | 'found' | 'not-found' | 'trophy';

@Component({
  selector: 'app-stat-card',
  imports: [CardModule, TimesCircle, ExclamationCircle, CheckCircle, Trophy],
  templateUrl: './stat-card.html',
})
export class StatCard {
  title = input.required<string>();
  value = input<string | number | null | undefined>();
  icon = input<iconTypes>();
  iconColor = input<string>(); 
}
