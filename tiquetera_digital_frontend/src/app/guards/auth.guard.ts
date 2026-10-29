import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    // Verificar si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      await this.showToast('Debe iniciar sesión para acceder');
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar si la ruta tiene restricciones de roles
    const roles = route.data['roles'] as string[];
    if (roles && roles.length > 0) {
      const userRole = this.authService.getUserRole();
      
      // Si el usuario no tiene el rol requerido
      if (!userRole || !roles.includes(userRole)) {
        await this.showToast('No tiene permisos para acceder a esta sección');
        
        // Redirigir a la página apropiada según el rol
        this.redirectBasedOnRole();
        return false;
      }
    }

    return true;
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }

  private redirectBasedOnRole(): void {
    const userRole = this.authService.getUserRole();
    
    switch (userRole) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'mesero':
        this.router.navigate(['/mesero']);
        break;
      case 'cajero':
        this.router.navigate(['/cajero']);
        break;
      case 'cliente':
        this.router.navigate(['/cliente']);
        break;
      default:
        this.router.navigate(['/tabs']);
    }
  }
} 