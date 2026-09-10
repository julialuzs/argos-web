import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loading } from '@core/components/loading/loading';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, Loading],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Argos');
}
