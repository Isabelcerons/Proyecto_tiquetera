import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { TiqueteraService, Tiquetera, MovimientoTiquetera } from '../services/tiquetera.service';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-cliente-tiquetera-detalle',
  templateUrl: './cliente-tiquetera-detalle.component.html',
  styleUrls: ['./cliente-tiquetera-detalle.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ClienteTiqueteraDetalleComponent implements OnInit {
  currentUser: User | null = null;
  tiquetera: Tiquetera | null = null;
  movimientos: MovimientoTiquetera[] = [];
  tiqueteraId: string = '';
  loading = true;
  errorMessage = '';

  constructor(
    private tiqueteraService: TiqueteraService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.tiqueteraId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.tiqueteraId) {
      this.loadTiquetera();
      this.loadMovimientos();
    } else {
      this.router.navigate(['/cliente']);
    }
  }

  loadTiquetera() {
    // En un entorno real, usaríamos:
    // this.tiqueteraService.getTiqueteraById(this.tiqueteraId).subscribe(...)
    
    // Para desarrollo, usamos datos simulados
    this.tiquetera = this.tiqueteraService.getTiqueterasMock()
      .find(t => t.id === this.tiqueteraId) || null;
    
    // Verificar que la tiquetera pertenezca al cliente actual
    if (this.tiquetera && this.currentUser && this.tiquetera.cliente_id !== this.currentUser.id) {
      this.errorMessage = 'No tiene permiso para ver esta tiquetera';
      this.tiquetera = null;
    }
    
    this.loading = false;
  }

  loadMovimientos() {
    // En un entorno real, usaríamos:
    // this.tiqueteraService.getMovimientos(this.tiqueteraId).subscribe(...)
    
    // Para desarrollo, usamos datos simulados
    this.movimientos = this.tiqueteraService.getMovimientosMock(this.tiqueteraId);
  }

  volver() {
    this.router.navigate(['/cliente']);
  }
} 