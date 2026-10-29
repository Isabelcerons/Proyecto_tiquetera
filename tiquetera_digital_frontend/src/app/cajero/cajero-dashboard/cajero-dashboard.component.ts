import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { OrdenService } from '../../services/orden.service';

@Component({
  selector: 'app-cajero-dashboard',
  templateUrl: './cajero-dashboard.component.html',
  styleUrls: ['./cajero-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CajeroDashboardComponent implements OnInit {
  currentUser: User | null = null;
  operacionesHoy = 0;
  ventasHoy = 0;
  loading = true;

  constructor(
    private authService: AuthService,
    private ordenService: OrdenService,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData() {
    // En un entorno real, obtendríamos métricas del dashboard desde el backend
    // Para desarrollo, simulamos datos
    setTimeout(() => {
      this.operacionesHoy = 15;
      this.ventasHoy = 450000;
      this.loading = false;
    }, 500);
  }

  navigateTo(route: string) {
    this.router.navigate(['/cajero/' + route]);
  }

  async logout() {
    await this.authService.logout();
  }
} 