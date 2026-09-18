import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Home } from '@primeicons/angular/home';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { filter, map, startWith } from 'rxjs';

export type ItemBreadcrumb = MenuItem & { current?: boolean };

export function montarItensBreadcrumb(url: string): ItemBreadcrumb[] {
  const segmentos = url.split(/[?#]/)[0].split('/').filter(Boolean);

  if (segmentos[0] === 'projetos') {
    return [{ label: 'Projetos', current: true }];
  }

  if (segmentos[0] === 'tutorial') {
    return [{ label: 'Tutorial', current: true }];
  }

  const guid = segmentos[0];
  const pagina = segmentos[1];

  if (pagina === 'dashboard') {
    return [{ label: 'Dashboard', current: true }];
  }

  if (pagina === 'relatorios' && segmentos[2]) {
    return [
      { label: 'Relatórios', routerLink: ['/', guid, 'relatorios'] },
      { label: 'Relatório de Acessibilidade', current: true },
    ];
  }

  if (pagina === 'relatorios') {
    return [{ label: 'Relatórios', current: true }];
  }

  return [];
}

@Component({
  selector: 'app-breadcrumb',
  imports: [BreadcrumbModule, RouterLink, Home],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css',
})
export class AppBreadcrumb {
  private readonly router = inject(Router);

  readonly inicio: MenuItem = { routerLink: '/projetos' };

  private readonly urlAtual = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { requireSync: true },
  );

  readonly itens = computed(() => montarItensBreadcrumb(this.urlAtual()));
}
