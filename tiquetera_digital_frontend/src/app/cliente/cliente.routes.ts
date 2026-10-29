import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./cliente-dashboard/cliente-dashboard.component').then(m => m.ClienteDashboardComponent)
  },
  {
    path: 'tiquetera/:id',
    loadComponent: () => import('./cliente-tiquetera-detalle.component').then(m => m.ClienteTiqueteraDetalleComponent)
  }
]; 