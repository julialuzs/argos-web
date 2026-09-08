import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@core/components/layout/layout').then((m) => m.Layout),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'projetos',
        pathMatch: 'full',
      },
      {
        path: 'tutorial',
        loadComponent: () => import('@features/tutorial/tutorial').then((m) => m.Tutorial),
      },
      {
        path: ':projetoGuid/relatorios',
        loadComponent: () => import('@features/relatorios/relatorios').then((m) => m.Relatorios),
      },
      {
        path: ':projetoGuid/relatorios/:relatorioId',
        loadComponent: () =>
          import('@features/relatorios/relatorio-detalhe/relatorio-detalhe').then(
            (m) => m.RelatorioDetalhe,
          ),
      },
      {
        path: ':projetoGuid/dashboard',
        loadComponent: () => import('@features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'projetos',
        loadComponent: () => import('@features/projetos/projetos').then((m) => m.Projetos),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('@features/login/login').then((m) => m.Login),
  },
  {
    path: 'cadastro',
    loadComponent: () => import('@features/cadastro/cadastro').then((m) => m.Cadastro),
  },
];
