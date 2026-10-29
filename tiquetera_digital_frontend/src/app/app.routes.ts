import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.routes),
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'mesero',
    loadChildren: () => import('./mesero/mesero.routes').then(m => m.routes),
    canActivate: [AuthGuard],
    data: { roles: ['mesero'] }
  },
  {
    path: 'cajero',
    loadChildren: () => import('./cajero/cajero.routes').then(m => m.routes),
    canActivate: [AuthGuard],
    data: { roles: ['cajero'] }
  },
  {
    path: 'cliente',
    loadChildren: () => import('./cliente/cliente.routes').then(m => m.routes),
    canActivate: [AuthGuard],
    data: { roles: ['cliente'] }
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
