import { PageNotFoundComponent } from './../shared/components/page-not-found-component/page-not-found-component';
import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/components/public-layout/public.layout.component';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
      {
        path: 'inicio',
        loadComponent: () => import('./home/components/home-component/home-component')
          .then(m => m.HomeComponent),
      },
      {
        path: 'escuelas',
        loadComponent: () => import('./escuelas/components/escuelas-listado/escuelas.listado.component')
          .then(m => m.EscuelasListadoComponent),
      },
      {
        path: 'centros-medicos',
        loadComponent: () => import("./../shared/components/page-not-found-component/page-not-found-component")
          .then(m => m.PageNotFoundComponent),
      },
      {
        path: 'centros-evaluacion',
        loadComponent: () => import("./../shared/components/page-not-found-component/page-not-found-component")
          .then(m => m.PageNotFoundComponent),
      }
    ],
  },
];
