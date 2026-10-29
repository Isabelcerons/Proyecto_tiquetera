import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Estado } from './estado.service';

export interface Mesa {
  id: string;
  numero: number;
  estado: Estado;
  capacidad: number;
  activa: boolean;
  zona: string;
  mesero_id?: string;
  mesero?: {
    id: string;
    nombre: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class MesaService {
  private apiUrl = `${environment.apiUrl}/mesas`;
  
  constructor(private http: HttpClient) { }

  // Obtener todas las mesas
  getMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(this.apiUrl);
  }

  // Obtener mesa por ID
  getMesaById(id: string): Observable<Mesa> {
    return this.http.get<Mesa>(`${this.apiUrl}/${id}`);
  }

  // Crear mesa
  createMesa(mesaData: Partial<Mesa>): Observable<Mesa> {
    return this.http.post<Mesa>(this.apiUrl, mesaData);
  }

  // Actualizar mesa
  updateMesa(id: string, mesaData: Partial<Mesa>): Observable<Mesa> {
    return this.http.patch<Mesa>(`${this.apiUrl}/${id}`, mesaData);
  }

  // Asignar mesero a mesa
  asignarMesero(mesaId: string, meseroId: string): Observable<Mesa> {
    return this.http.patch<Mesa>(`${this.apiUrl}/${mesaId}/asignar-mesero`, { mesero_id: meseroId });
  }

  // Cambiar estado de mesa
  cambiarEstado(mesaId: string, estado: Mesa['estado']): Observable<Mesa> {
    return this.http.patch<Mesa>(`${this.apiUrl}/${mesaId}/estado`, { estado });
  }

  // Eliminar mesa
  deleteMesa(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Para pruebas: Datos simulados
  getMesasMock(): Mesa[] {
    const mockEstado = (nombre: string): Estado => ({ id: Math.random(), nombre });
    return [
      {
        id: 'mesa-1',
        numero: 1,
        estado: mockEstado('disponible'),
        capacidad: 4,
        activa: true,
        zona: 'Terraza'
      },
      {
        id: 'mesa-2',
        numero: 2,
        estado: mockEstado('ocupada'),
        capacidad: 2,
        activa: true,
        zona: 'Interior',
        mesero_id: 'mesero-id',
        mesero: {
          id: 'mesero-id',
          nombre: 'Mesero Prueba'
        }
      },
      {
        id: 'mesa-3',
        numero: 3,
        estado: mockEstado('reservada'),
        capacidad: 6,
        activa: true,
        zona: 'Terraza'
      },
      {
        id: 'mesa-4',
        numero: 4,
        estado: mockEstado('disponible'),
        capacidad: 4,
        activa: true,
        zona: 'Interior'
      },
      {
        id: 'mesa-5',
        numero: 5,
        estado: mockEstado('mantenimiento'),
        capacidad: 8,
        activa: false,
        zona: 'VIP'
      }
    ];
  }

  getMesasByMesero(meseroId: string): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${this.apiUrl}?mesero_id=${meseroId}`);
  }
} 