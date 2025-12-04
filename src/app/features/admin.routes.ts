import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/components/admin-layout/layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'escuelas',
        pathMatch: 'full',
      },
      {
        path: 'escuelas',
        loadComponent: () => import('./escuelas/components/escuela-listado/escuela.listado.component')
          .then(m => m.EscuelaListadoComponent),
      },
      {
        path: 'escuelas/registro',
        loadComponent: () => import('./escuelas/components/escuela-registro/escuela.registro.component')
          .then(m => m.EscuelaRegistroComponent),
      },
      {
        path: 'escuelas/editar/:id',
        loadComponent: () => import('./escuelas/components/escuela-editar/escuela.editar.component')
          .then(m => m.EscuelaEditarComponent),
      },
      {
        path: 'escuelas/listado',
        loadComponent: () => import('./escuelas/components/escuela-listado/escuela.listado.component')
          .then(m => m.EscuelaListadoComponent),
      }
    ],
  },
];
