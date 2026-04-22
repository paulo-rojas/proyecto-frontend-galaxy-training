import { Routes } from '@angular/router';
import {PageNotFoundComponent} from './shared/components/page-not-found-component/page-not-found-component';
import {ActualizarDialogComponent} from './features/escuelas/components/actualizar-dialog/actualizar.dialog.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full',
  },
  {
    path: 'public',
    loadChildren: () => import('./public/public.routes').then(m => m.PUBLIC_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'login',
    loadComponent: () => import('./public/login/components/login').then(m => m.Login),
  },
  {
    path: 'test',
    component: ActualizarDialogComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
