import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./mesero-dashboard/mesero-dashboard.component').then(m => m.MeseroDashboardComponent)
  },
  {
    path: 'mesas',
    loadComponent: () => import('./mesas/mesas.page').then( m => m.MesasPage)
  },
  {
    path: 'mesas/:id/orden',
    loadComponent: () => import('./orden/orden.page').then(m => m.OrdenPage)
  },
  {
    path: 'orden/:id',
    loadComponent: () => import('./orden/orden.page').then(m => m.OrdenPage)
  }
]; 