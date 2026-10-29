import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProductoService, Producto } from '../../services/producto.service';

@Component({
  selector: 'app-admin-productos',
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class AdminProductosComponent implements OnInit {
  productos: Producto[] = [];
  loading = true;

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadProductos();
  }

  loadProductos() {
    // En un entorno real, esta sería una llamada al API
    // Para desarrollo, usamos datos simulados
    this.productos = this.productoService.getProductosMock();
    this.loading = false;
  }

  volver() {
    this.router.navigate(['/admin']);
  }
} 