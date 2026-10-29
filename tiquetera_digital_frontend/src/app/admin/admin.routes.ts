import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'mesas',
    loadComponent: () => import('./mesas/admin-mesas.component').then(m => m.AdminMesasComponent)
  },
  {
    path: 'productos',
    loadComponent: () => import('./productos/admin-productos.component').then(m => m.AdminProductosComponent)
  },
  {
    path: 'tiqueteras',
    loadComponent: () => import('./tiqueteras/admin-tiqueteras.component').then(m => m.AdminTiqueterasComponent)
  },
  {
    path: 'tiqueteras/detalle/:id',
    loadComponent: () => import('./tiqueteras/tiquetera-detalle.component').then(m => m.TiqueteraDetalleComponent)
  },
  {
    path: 'tiqueteras/crear',
    loadComponent: () => import('./tiqueteras/tiquetera-crear.component').then(m => m.TiqueteraCrearComponent)
  },
  {
    path: 'reportes',
    loadComponent: () => import('./reportes/admin-reportes.component').then(m => m.AdminReportesComponent)
  }
]; 