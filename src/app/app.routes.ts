import { Routes } from '@angular/router';
import { EscuelaListadoComponent } from './features/admin/escuelas/components/escuela.listado.component/escuela.listado.component';
import { LayoutAdminComponent } from './features/admin/layout/layout.component/layout.component';
import { PublicLayoutComponent } from './features/public/layout/public.layout.component/public.layout.component';
import { LoginComponent } from './shared/components/login.component/login.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: LayoutAdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'escuelas',
        pathMatch: 'full',
      },
      {
        path: 'escuelas',
        component: EscuelaListadoComponent,
      },
      {
        path: 'escuelas/registro',
        loadComponent: () =>
          import(
            './features/admin/escuelas/components/escuela.registro.component/escuela.registro.component'
          ).then((m) => m.EscuelaRegistroComponent),
      },
      {
        path: 'escuelas/editar/:id',
        loadComponent: () =>
          import(
            './features/admin/escuelas/components/escuela.editar.component/escuela.editar.component'
          ).then((m) => m.EscuelaEditarComponent),
      }
    ],
  },
  {
    path: 'escuelas',
    component: PublicLayoutComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'escuelas',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'escuelas',
    pathMatch: 'full',
  },

];
