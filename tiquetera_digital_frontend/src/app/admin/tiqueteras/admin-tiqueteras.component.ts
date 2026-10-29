import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { TiqueteraService, Tiquetera } from '../../services/tiquetera.service';

@Component({
  selector: 'app-admin-tiqueteras',
  templateUrl: './admin-tiqueteras.component.html',
  styleUrls: ['./admin-tiqueteras.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class AdminTiqueterasComponent implements OnInit {
  tiqueteras: Tiquetera[] = [];
  loading = true;

  constructor(
    private tiqueteraService: TiqueteraService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadTiqueteras();
  }

  loadTiqueteras() {
    // En un entorno real, esta sería una llamada al API
    // Para desarrollo, usamos datos simulados
    setTimeout(() => {
      this.tiqueteras = this.tiqueteraService.getTiqueterasMock();
      this.loading = false;
    }, 500);
  }

  verDetalle(id: string) {
    this.router.navigate(['/admin/tiqueteras/detalle', id]);
  }

  crearTiquetera() {
    this.router.navigate(['/admin/tiqueteras/crear']);
  }

  volver() {
    this.router.navigate(['/admin']);
  }
} 