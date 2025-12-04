import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/components/public-layout/public.layout.component';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./escuelas/components/escuelas-listado/escuelas.listado.component')
          .then(m => m.EscuelasListadoComponent),
      },
    ],
  },
];
