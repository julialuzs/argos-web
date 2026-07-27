import { Routes } from '@angular/router';
import { Login } from '@features/login/login';
import { Cadastro } from '@features/cadastro/cadastro';
import { authGuard } from '@core/guards/auth.guard';
import { Layout } from '@core/components/layout/layout';
import { Relatorios } from '@features/relatorios/relatorios';
import { Dashboard } from '@features/dashboard/dashboard';
import { Projetos } from '@features/projetos/projetos';
import { RelatorioDetalhe } from '@features/relatorios/relatorio-detalhe/relatorio-detalhe';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'projetos',
        pathMatch: 'full',
      },
      {
        path: ':projetoId/relatorios',
        component: Relatorios,
      },
      {
        path: ':projetoId/relatorios/:relatorioId',
        component: RelatorioDetalhe,
      },
      {
        path: ':projetoId/dashboard',
        component: Dashboard,
      },
      {
        path: 'projetos',
        component: Projetos,
      }, 
    ],
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'cadastro',
    component: Cadastro,
  },
];
