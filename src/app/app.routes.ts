import { Routes } from '@angular/router';
import { Login } from '@features/login/login';
import { Cadastro } from '@features/cadastro/cadastro';
import { authGuard } from '@core/guards/auth.guard';
import { Layout } from '@core/components/layout/layout';
import { Relatorios } from '@features/relatorios/relatorios';
import { Dashboard } from '@features/dashboard/dashboard';
import { Projetos } from '@features/projetos/projetos';
import { RelatorioDetalhe } from '@features/relatorios/relatorio-detalhe/relatorio-detalhe';
import { Tutorial } from '@features/tutorial/tutorial';

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
        path: 'tutorial',
        component: Tutorial,
      },
      {
        path: ':projetoGuid/relatorios',
        component: Relatorios,
      },
      {
        path: ':projetoGuid/relatorios/:relatorioId',
        component: RelatorioDetalhe,
      },
      {
        path: ':projetoGuid/dashboard',
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
