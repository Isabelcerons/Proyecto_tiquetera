import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Adaptada para coincidir con la entidad del backend
export interface Tiquetera {
  id: string;
  cliente_id: string;
  cliente?: {
    id: string;
    nombre: string;
    email: string;
  };
  saldoInicial: number; // Cantidad inicial de tickets/comidas
  saldoDisponible: number; // Tickets/comidas restantes
  total_asignado: number; // Total de tickets/comidas asignados a lo largo del tiempo
  usados: number; // Tickets/comidas consumidos
  pendientes: number;
  activo: boolean;
  estado: string;
  fechaVencimiento?: Date;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Adaptada para coincidir con MovimientoTiquetera del backend
export interface MovimientoTiquetera {
  id: string;
  tiquetera_id: string;
  tipo: 'carga' | 'consumo' | 'ajuste';
  monto: number; // Cantidad de tickets/comidas agregados o consumidos
  saldoAnterior: number; // Tickets/comidas antes de la operación
  saldoNuevo: number; // Tickets/comidas después de la operación
  pedido_id?: string;
  descripcion?: string;
  usuario_id?: string;
  fecha: Date;
}

// DTO para crear transacciones/movimientos
export interface CreateMovimientoDto {
  monto: number; // Cantidad de tickets/comidas a agregar o consumir
  descripcion?: string;
  referencia?: string;
  tiquetera_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TiqueteraService {
  private apiUrl = `${environment.apiUrl}/tiqueteras`;
  
  constructor(private http: HttpClient) { }

  // Obtener todas las tiqueteras
  getTiqueteras(): Observable<Tiquetera[]> {
    return this.http.get<Tiquetera[]>(this.apiUrl);
  }

  // Obtener tiqueteras por ID de cliente
  getTiqueterasByCliente(clienteId: string): Observable<Tiquetera[]> {
    return this.http.get<Tiquetera[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  // Obtener tiquetera por ID
  getTiqueteraById(id: string): Observable<Tiquetera> {
    return this.http.get<Tiquetera>(`${this.apiUrl}/${id}`);
  }

  // Crear nueva tiquetera
  createTiquetera(createTiqueteraDto: {
    cliente_id: string;
    saldoInicial: number; // Cantidad de tickets/comidas
    fechaVencimiento?: Date;
    activa?: boolean;
  }): Observable<Tiquetera> {
    return this.http.post<Tiquetera>(this.apiUrl, createTiqueteraDto);
  }

  // Actualizar tiquetera
  updateTiquetera(id: string, updateTiqueteraDto: {
    fechaVencimiento?: Date;
    activa?: boolean;
  }): Observable<Tiquetera> {
    return this.http.patch<Tiquetera>(`${this.apiUrl}/${id}`, updateTiqueteraDto);
  }

  // Eliminar/desactivar tiquetera
  removeTiquetera(id: string): Observable<Tiquetera> {
    return this.http.delete<Tiquetera>(`${this.apiUrl}/${id}`);
  }

  // Cargar tickets a tiquetera
  cargarSaldo(id: string, data: CreateMovimientoDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/cargar`, data);
  }

  // Validar si se puede hacer un consumo
  validarConsumo(id: string, monto: number): Observable<{
    valido: boolean;
    mensaje: string;
    saldoDisponible: number;
  }> {
    return this.http.post<any>(`${this.apiUrl}/${id}/validar-consumo`, { monto });
  }

  // Registrar consumo
  registrarConsumo(id: string, data: CreateMovimientoDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/consumir`, data);
  }

  // Obtener historial de movimientos
  getMovimientos(id: string): Observable<MovimientoTiquetera[]> {
    return this.http.get<MovimientoTiquetera[]>(`${this.apiUrl}/${id}/movimientos`);
  }

  // Para pruebas: Obtener tiqueteras simuladas
  getTiqueterasMock(): Tiquetera[] {
    return [
      {
        id: '1',
        cliente_id: 'cliente-id',
        cliente: {
          id: 'cliente-id',
          nombre: 'Juan Pérez',
          email: 'juan@example.com'
        },
        saldoInicial: 30, // 30 tickets/comidas
        saldoDisponible: 12, // 12 tickets/comidas restantes
        total_asignado: 30,
        usados: 18, // 18 tickets/comidas consumidos
        pendientes: 0,
        activo: true,
        estado: 'activa',
        fechaVencimiento: new Date('2024-10-01'),
        fechaCreacion: new Date('2023-10-01'),
        fechaActualizacion: new Date('2023-10-01')
      },
      {
        id: '2',
        cliente_id: 'cliente-id-2',
        cliente: {
          id: 'cliente-id-2',
          nombre: 'María López',
          email: 'maria@example.com'
        },
        saldoInicial: 30, // 30 tickets/comidas
        saldoDisponible: 30, // 30 tickets/comidas restantes
        total_asignado: 30,
        usados: 0, // 0 tickets/comidas consumidos
        pendientes: 0,
        activo: true,
        estado: 'activa',
        fechaVencimiento: new Date('2024-09-15'),
        fechaCreacion: new Date('2023-09-15'),
        fechaActualizacion: new Date('2023-09-15')
      }
    ];
  }

  // Obtener movimientos simulados
  getMovimientosMock(tiqueteraId: string): MovimientoTiquetera[] {
    return [
      {
        id: 't1',
        tiquetera_id: tiqueteraId,
        tipo: 'carga',
        monto: 30, // Carga inicial de 30 tickets/comidas
        saldoAnterior: 0,
        saldoNuevo: 30,
        descripcion: 'Carga inicial de tickets',
        usuario_id: 'admin-id',
        fecha: new Date('2023-10-01')
      },
      {
        id: 't2',
        tiquetera_id: tiqueteraId,
        tipo: 'consumo',
        monto: -8, // Consumo de 8 tickets/comidas
        saldoAnterior: 30,
        saldoNuevo: 22,
        pedido_id: 'orden-id-1',
        usuario_id: 'cajero-id',
        fecha: new Date('2023-10-15')
      },
      {
        id: 't3',
        tiquetera_id: tiqueteraId,
        tipo: 'consumo',
        monto: -10, // Consumo de 10 tickets/comidas
        saldoAnterior: 22,
        saldoNuevo: 12,
        pedido_id: 'orden-id-2',
        usuario_id: 'cajero-id',
        fecha: new Date('2023-11-05')
      }
    ];
  }
} 