import { Routes } from '@angular/router';
import { Login } from '@features/login/login';
import { Cadastro } from '@features/cadastro/cadastro';
import { authGuard } from '@core/guards/auth.guard';
import { Layout } from '@core/components/layout/layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'cadastro',
    component: Cadastro,
  },
  {
    path: 'layout',
    component: Layout,
    canActivate: [authGuard],
  }
];
