import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { MesaService, Mesa } from '../../services/mesa.service';
import { ProductoService, Producto } from '../../services/producto.service';
import { OrdenService, Orden, OrdenItem } from '../../services/orden.service';
import { TiqueteraService, Tiquetera } from '../../services/tiquetera.service';

interface DashboardMetrics {
  mesasOcupadas: number;
  mesasDisponibles: number;
  mesasTotal: number;
  ordenesAbiertas: number;
  productosMasVendidos: {nombre: string, cantidad: number}[];
  ventasHoy: number;
  tiqueterasActivas: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  metrics: DashboardMetrics = {
    mesasOcupadas: 0,
    mesasDisponibles: 0,
    mesasTotal: 0,
    ordenesAbiertas: 0,
    productosMasVendidos: [],
    ventasHoy: 0,
    tiqueterasActivas: 0
  };
  mesas: Mesa[] = [];
  ordenes: Orden[] = [];
  tiqueteras: Tiquetera[] = [];
  loading = true;

  // Propiedades agregadas para evitar errores de tipo
  totalMesas: number = 0;
  mesasOcupadas: number = 0;
  mesasDisponibles: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private mesaService: MesaService,
    private productoService: ProductoService,
    private ordenService: OrdenService,
    private tiqueteraService: TiqueteraService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData() {
    // En un entorno real, estas llamadas serían a la API
    // Pero para desarrollo usamos los datos simulados
    
    // Cargar mesas
    this.mesaService.getMesas().subscribe(mesas => {
      this.mesas = mesas;
      this.totalMesas = this.mesas.length;
      this.mesasOcupadas = this.mesas.filter(m => m.estado?.nombre === 'ocupada').length;
      this.mesasDisponibles = this.mesas.filter(m => m.estado?.nombre === 'disponible').length;
      this.loading = false;
    });
    
    // Cargar órdenes
    this.ordenes = this.ordenService.getOrdenesMock();
    
    // Cargar tiqueteras
    this.tiqueteras = this.tiqueteraService.getTiqueterasMock();
    
    // Calcular métricas
    this.calculateMetrics();
  }

  calculateMetrics() {
    // Métricas de mesas
    this.metrics.mesasTotal = this.mesas.length;
    this.metrics.mesasOcupadas = this.mesas.filter(m => m.estado?.nombre === 'ocupada').length;
    this.metrics.mesasDisponibles = this.mesas.filter(m => m.estado?.nombre === 'disponible').length;
    
    // Órdenes abiertas
    this.metrics.ordenesAbiertas = this.ordenes.filter(o => o.estado === 'abierta').length;
    
    // Tiqueteras activas
    this.metrics.tiqueterasActivas = this.tiqueteras.filter(t => t.estado === 'activa').length;
    
    // Ventas del día (simulado)
    this.metrics.ventasHoy = this.ordenes
      .filter(o => o.estado === 'pagada' || o.estado === 'cerrada')
      .reduce((sum, orden) => sum + orden.total, 0);
    
    // Productos más vendidos (simulado)
    const productosIds: Array<{ id: string, cantidad: number }> = [];
    this.ordenes.forEach(o => {
      o.items.forEach(item => {
        productosIds.push({ id: item.productoId, cantidad: item.cantidad });
      });
    });
    
    const productosCount: {[key: string]: number} = {};
    productosIds.forEach(p => {
      productosCount[p.id] = (productosCount[p.id] || 0) + p.cantidad;
    });
    
    const productos = this.productoService.getProductosMock();
    this.metrics.productosMasVendidos = Object.entries(productosCount)
      .map(([id, cantidad]) => ({
        nombre: productos.find(p => p.id === id)?.nombre || 'Desconocido',
        cantidad
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 3);
  }

  async logout() {
    await this.authService.logout();
  }

  navigateToSection(route: string) {
    this.router.navigate(['/admin/' + route]);
  }
} 