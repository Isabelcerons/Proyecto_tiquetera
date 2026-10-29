import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TiqueteraService, Tiquetera } from '../../services/tiquetera.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-buscar-tiquetera',
  templateUrl: './buscar-tiquetera.component.html',
  styleUrls: ['./buscar-tiquetera.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class BuscarTiqueteraComponent implements OnInit {
  busqueda: string = '';
  resultados: Tiquetera[] = [];
  buscando = false;
  errorMessage = '';
  
  // Para acceso rápido en demostración
  clientesRecientes: { id: string, nombre: string }[] = [
    { id: 'cliente-id', nombre: 'Juan Pérez' },
    { id: 'cliente-id-2', nombre: 'María López' }
  ];

  constructor(
    private tiqueteraService: TiqueteraService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // En un entorno real, podríamos cargar los clientes recientes del cajero
  }

  buscarTiquetera() {
    if (!this.busqueda.trim()) {
      this.errorMessage = 'Ingrese un criterio de búsqueda';
      return;
    }
    
    this.buscando = true;
    this.errorMessage = '';
    
    // En un entorno real usaríamos:
    // this.tiqueteraService.buscarTiqueteras(this.busqueda).subscribe(...)
    
    // Para desarrollo, simulamos la búsqueda
    setTimeout(() => {
      const todasTiqueteras = this.tiqueteraService.getTiqueterasMock();
      
      this.resultados = todasTiqueteras.filter(t => {
        const termino = this.busqueda.toLowerCase();
        const clienteNombre = t.cliente?.nombre?.toLowerCase() || '';
        const clienteEmail = t.cliente?.email?.toLowerCase() || '';
        const id = t.id.toLowerCase();
        
        return clienteNombre.includes(termino) || 
               clienteEmail.includes(termino) || 
               id.includes(termino);
      });
      
      this.buscando = false;
    }, 800);
  }

  buscarPorCliente(clienteId: string) {
    this.buscando = true;
    this.errorMessage = '';
    
    // En un entorno real usaríamos:
    // this.tiqueteraService.getTiqueterasByCliente(clienteId).subscribe(...)
    
    // Para desarrollo, simulamos la búsqueda por cliente
    setTimeout(() => {
      const todasTiqueteras = this.tiqueteraService.getTiqueterasMock();
      this.resultados = todasTiqueteras.filter(t => t.cliente_id === clienteId);
      this.buscando = false;
    }, 500);
  }

  verDetalle(id: string) {
    this.router.navigate(['/cajero/tiquetera', id]);
  }

  volver() {
    this.router.navigate(['/cajero']);
  }
} 