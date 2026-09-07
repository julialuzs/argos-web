import { Component, computed, inject } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {
  private loadingService = inject(LoadingService);
  protected readonly isLoading = computed(() => this.loadingService.isLoading());
}
