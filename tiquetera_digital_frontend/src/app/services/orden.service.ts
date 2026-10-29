import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrdenItem {
  id: string;
  productoId: string;
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
  notas?: string;
  estado: 'pendiente' | 'preparando' | 'listo' | 'entregado' | 'cancelado';
}

export interface Orden {
  id: string;
  mesa_id: string;
  mesero_id: string;
  cliente_id?: string;
  estado: 'abierta' | 'cerrada' | 'pagada' | 'cancelada';
  items: OrdenItem[];
  subtotal: number;
  impuestos: number;
  propina?: number;
  descuento?: number;
  total: number;
  metodo_pago?: string;
  tiquetera_id?: string;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  fecha_cierre?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private apiUrl = `${environment.apiUrl}/ordenes`;

  constructor(private http: HttpClient) { }

  // Obtener todas las órdenes
  getOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(this.apiUrl);
  }

  // Obtener orden por ID
  getOrdenById(id: string): Observable<Orden> {
    return this.http.get<Orden>(`${this.apiUrl}/${id}`);
  }

  // Obtener órdenes por mesa
  getOrdenesByMesa(mesaId: string): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.apiUrl}/mesa/${mesaId}`);
  }

  // Obtener órdenes por mesero
  getOrdenesByMesero(meseroId: string): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.apiUrl}/mesero/${meseroId}`);
  }

  // Crear orden
  createOrden(ordenData: Partial<Orden>): Observable<Orden> {
    return this.http.post<Orden>(this.apiUrl, ordenData);
  }

  // Actualizar orden
  updateOrden(id: string, ordenData: Partial<Orden>): Observable<Orden> {
    return this.http.patch<Orden>(`${this.apiUrl}/${id}`, ordenData);
  }

  // Añadir item a orden
  addItem(ordenId: string, item: Omit<OrdenItem, 'id'>): Observable<Orden> {
    return this.http.post<Orden>(`${this.apiUrl}/${ordenId}/items`, item);
  }

  // Actualizar item de orden
  updateItem(ordenId: string, itemId: string, data: Partial<OrdenItem>): Observable<Orden> {
    return this.http.patch<Orden>(`${this.apiUrl}/${ordenId}/items/${itemId}`, data);
  }

  // Eliminar item de orden
  removeItem(ordenId: string, itemId: string): Observable<Orden> {
    return this.http.delete<Orden>(`${this.apiUrl}/${ordenId}/items/${itemId}`);
  }

  // Cerrar orden
  cerrarOrden(ordenId: string): Observable<Orden> {
    return this.http.patch<Orden>(`${this.apiUrl}/${ordenId}/cerrar`, {});
  }

  // Procesar pago con tiquetera
  pagarConTiquetera(ordenId: string, tiqueteraId: string): Observable<Orden> {
    return this.http.post<Orden>(`${this.apiUrl}/${ordenId}/pagar-tiquetera`, { tiquetera_id: tiqueteraId });
  }

  // Para pruebas: Obtener órdenes simuladas
  getOrdenesMock(): Orden[] {
    return [
      {
        id: 'orden-1',
        mesa_id: 'mesa-2',
        mesero_id: 'mesero-id',
        estado: 'abierta',
        items: [
          {
            id: 'item-1',
            productoId: 'prod-1',
            nombre: 'Hamburguesa',
            cantidad: 2,
            precio: 15000,
            subtotal: 30000,
            estado: 'entregado'
          },
          {
            id: 'item-2',
            productoId: 'prod-5',
            nombre: 'Limonada',
            cantidad: 2,
            precio: 5000,
            subtotal: 10000,
            estado: 'entregado'
          }
        ],
        subtotal: 40000,
        impuestos: 7600,
        total: 47600,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date()
      },
      {
        id: 'orden-2',
        mesa_id: 'mesa-3',
        mesero_id: 'mesero-id',
        cliente_id: 'cliente-id',
        estado: 'pagada',
        items: [
          {
            id: 'item-3',
            productoId: 'prod-3',
            nombre: 'Pasta Carbonara',
            cantidad: 1,
            precio: 28000,
            subtotal: 28000,
            estado: 'entregado'
          }
        ],
        subtotal: 28000,
        impuestos: 5320,
        propina: 3000,
        total: 36320,
        metodo_pago: 'tiquetera',
        tiquetera_id: '1',
        fecha_creacion: new Date(Date.now() - 24 * 60 * 60 * 1000),
        fecha_actualizacion: new Date(Date.now() - 23 * 60 * 60 * 1000),
        fecha_cierre: new Date(Date.now() - 23 * 60 * 60 * 1000)
      }
    ];
  }
} 