import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./cajero-dashboard/cajero-dashboard.component').then(m => m.CajeroDashboardComponent)
  },
  {
    path: 'buscar-tiquetera',
    loadComponent: () => import('./buscar-tiquetera/buscar-tiquetera.component').then(m => m.BuscarTiqueteraComponent)
  },
  {
    path: 'tiquetera/:id',
    loadComponent: () => import('./tiquetera-consumo/tiquetera-consumo.component').then(m => m.TiqueteraConsumoComponent)
  },
  {
    path: 'ordenes',
    loadComponent: () => import('./ordenes/ordenes.component').then(m => m.OrdenesComponent)
  },
  {
    path: 'pagos',
    loadComponent: () => import('./pagos/pagos.component').then(m => m.PagosComponent)
  },
  {
    path: 'reporte-diario',
    loadComponent: () => import('./reporte-diario/reporte-diario.component').then(m => m.ReporteDiarioComponent)
  }
]; 