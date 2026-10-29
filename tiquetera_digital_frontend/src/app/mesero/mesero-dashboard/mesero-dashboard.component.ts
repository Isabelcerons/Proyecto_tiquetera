import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { logOutOutline, restaurantOutline, listOutline, addCircleOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-mesero-dashboard',
  templateUrl: './mesero-dashboard.component.html',
  styleUrls: ['./mesero-dashboard.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MeseroDashboardComponent implements OnInit {
  currentUser: User | null = null;
  mesasAsignadas = 0;
  pedidosActivos = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ logOutOutline, restaurantOutline, listOutline, addCircleOutline, personOutline });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    // Aquí se puede añadir la lógica para cargar los resúmenes (mesasAsignadas, etc.)
  }

  navigateTo(route: string) {
    this.router.navigate(['/mesero/' + route]);
  }

  async logout() {
    await this.authService.logout();
  }
} 