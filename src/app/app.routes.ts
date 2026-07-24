import { Routes } from '@angular/router';
import { Login } from '@features/login/login';
import { Cadastro } from '@features/cadastro/cadastro';
import { authGuard } from '@core/guards/auth.guard';
import { Layout } from '@core/components/layout/layout';
import { Relatorios } from '@features/relatorios/relatorios';
import { Dashboard } from '@features/dashboard/dashboard';
import { Projetos } from '@features/projetos/projetos';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'relatorios',
        component: Relatorios,
      },
      {
        path: 'dashboard',
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
