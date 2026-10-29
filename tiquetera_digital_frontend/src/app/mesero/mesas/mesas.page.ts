import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { MesaService, Mesa } from '../../services/mesa.service';
import { AuthService, User } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.page.html',
  styleUrls: ['./mesas.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class MesasPage implements OnInit {
  mesas: Mesa[] = [];
  currentUser: User | null = null;
  loading = true;

  constructor(
    private mesaService: MesaService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ arrowBack });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadMesasAsignadas();
    } else {
      // Manejar caso donde no hay usuario, quizás redirigir a login
      this.loading = false;
    }
  }

  loadMesasAsignadas() {
    this.loading = true;
    this.mesaService.getMesasByMesero(this.currentUser!.id).subscribe({
      next: (data) => {
        this.mesas = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        // Aquí podrías mostrar un toast o mensaje de error
      }
    });
  }

  irADetalle(mesaId: string) {
    this.router.navigate(['/mesero/orden', mesaId]);
  }

  regresar() {
    this.router.navigate(['/mesero']);
  }

  volver() {
    this.router.navigate(['/mesero']);
  }

  seleccionarMesa(mesa: Mesa) {
    console.log('Seleccionando mesa:', mesa.id);
    this.router.navigate(['/mesero/mesas', mesa.id, 'orden']);
  }
} 