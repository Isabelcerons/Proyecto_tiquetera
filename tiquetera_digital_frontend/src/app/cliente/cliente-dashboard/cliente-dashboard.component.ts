import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { TiqueteraService, Tiquetera } from '../../services/tiquetera.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-cliente-dashboard',
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ClienteDashboardComponent implements OnInit {
  currentUser: User | null = null;
  tiqueteras: Tiquetera[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private tiqueteraService: TiqueteraService,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTiqueteras();
  }

  loadTiqueteras() {
    if (!this.currentUser?.id) {
      this.loading = false;
      return;
    }

    // Cargar tiqueteras del cliente desde el backend
    this.tiqueteraService.getTiqueterasByCliente(this.currentUser.id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (tiqueteras) => {
          this.tiqueteras = tiqueteras;
        },
        error: (error) => {
          console.error('Error al cargar tiqueteras:', error);
          // En caso de error, cargar datos simulados como respaldo
          this.tiqueteras = this.tiqueteraService.getTiqueterasMock()
            .filter(t => t.cliente_id === this.currentUser?.id);
          
          this.showErrorToast('Error al cargar tiqueteras. Mostrando datos locales.');
        }
      });
  }

  async showErrorToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: 'warning'
    });
    toast.present();
  }

  verDetalleTiquetera(id: string) {
    this.router.navigate(['/cliente/tiquetera', id]);
  }

  async logout() {
    await this.authService.logout();
  }
} 