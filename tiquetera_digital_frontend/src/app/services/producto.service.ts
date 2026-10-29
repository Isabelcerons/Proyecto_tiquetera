import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  disponible: boolean;
  imagen?: string;
  tiempoPreparacion?: number; // en minutos
  ingredientes?: string[];
  alergenos?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = `${environment.apiUrl}/productos`;
  
  constructor(private http: HttpClient) { }

  // Obtener todos los productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  // Obtener productos disponibles
  getProductosDisponibles(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/disponibles`);
  }

  // Obtener producto por ID
  getProductoById(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  // Obtener productos por categoría
  getProductosByCategoria(categoria: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/categoria/${categoria}`);
  }

  // Crear producto
  createProducto(productoData: Omit<Producto, 'id'>): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, productoData);
  }

  // Actualizar producto
  updateProducto(id: string, productoData: Partial<Producto>): Observable<Producto> {
    return this.http.patch<Producto>(`${this.apiUrl}/${id}`, productoData);
  }

  // Eliminar producto
  deleteProducto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Cambiar disponibilidad del producto
  cambiarDisponibilidad(id: string, disponible: boolean): Observable<Producto> {
    return this.http.patch<Producto>(`${this.apiUrl}/${id}/disponibilidad`, { disponible });
  }

  // Obtener categorías disponibles
  getCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categorias`);
  }

  // Para pruebas: Obtener productos simulados
  getProductosMock(): Producto[] {
    return [
      {
        id: 'prod-1',
        nombre: 'Hamburguesa Clásica',
        descripcion: 'Hamburguesa con carne de res, queso, lechuga, tomate y cebolla',
        precio: 15000,
        categoria: 'Platos Principales',
        disponible: true,
        tiempoPreparacion: 15,
        ingredientes: ['Carne de res', 'Pan', 'Queso', 'Lechuga', 'Tomate', 'Cebolla']
      },
      {
        id: 'prod-2',
        nombre: 'Pizza Margarita',
        descripcion: 'Pizza con salsa de tomate, queso mozzarella y albahaca',
        precio: 22000,
        categoria: 'Platos Principales',
        disponible: true,
        tiempoPreparacion: 20,
        ingredientes: ['Masa', 'Salsa de tomate', 'Queso mozzarella', 'Albahaca']
      },
      {
        id: 'prod-3',
        nombre: 'Pasta Carbonara',
        descripcion: 'Pasta con salsa cremosa, panceta y queso parmesano',
        precio: 28000,
        categoria: 'Platos Principales',
        disponible: true,
        tiempoPreparacion: 18,
        ingredientes: ['Pasta', 'Huevo', 'Panceta', 'Queso parmesano', 'Pimienta negra']
      },
      {
        id: 'prod-4',
        nombre: 'Ensalada César',
        descripcion: 'Lechuga romana, crutones, pollo, queso parmesano y salsa césar',
        precio: 18000,
        categoria: 'Ensaladas',
        disponible: true,
        tiempoPreparacion: 10,
        ingredientes: ['Lechuga romana', 'Pollo', 'Crutones', 'Queso parmesano', 'Salsa césar']
      },
      {
        id: 'prod-5',
        nombre: 'Limonada Natural',
        descripcion: 'Limonada fresca preparada con limones naturales',
        precio: 5000,
        categoria: 'Bebidas',
        disponible: true,
        tiempoPreparacion: 5,
        ingredientes: ['Limón', 'Agua', 'Azúcar']
      }
    ];
  }

  // Obtener categorías simuladas
  getCategoriasMock(): string[] {
    return ['Entradas', 'Platos principales', 'Postres', 'Bebidas', 'Acompañamientos'];
  }
} 