import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './auth.service';
import { map } from 'rxjs/operators';

export interface UserDTO {
  id?: string;
  nombre: string;
  usuario: string;
  contrasena: string;
  cedula?: string;
  pin?: string;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/${role}`);
  }

  create(user: UserDTO): Observable<User> {
    // Mapear al formato esperado por el backend
    const backendUser = {
      nombre: user.nombre,
      usuario: user.usuario,
      contrasena: user.contrasena,
      cedula: user.cedula,
      pin: user.pin
    };
    return this.http.post<User>(this.apiUrl, backendUser);
  }

  update(id: string, user: Partial<UserDTO>): Observable<User> {
    // Mapear al formato esperado por el backend
    const backendUser = {
      contrasena: user.contrasena,
      isActive: user.activo,
      cedula: user.cedula,
      pin: user.pin
    };
    return this.http.put<User>(`${this.apiUrl}/${id}`, backendUser);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Buscar usuarios por nombre (parcial)
  searchByName(name: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search?name=${encodeURIComponent(name)}`);
  }

  // Para compatibilidad con el código existente, mantenemos los métodos mock
  // pero los usuarios reales se obtendrán del backend
  getUsersMock(): User[] {
    return [
      { id: 'admin-id', username: 'admin', nombre: 'Administrador', rol: 'admin' },
      { id: 'cajero-id', username: 'cajero', nombre: 'Cajero Prueba', rol: 'cajero' },
      { id: 'mesero-id', username: 'mesero', nombre: 'Mesero Prueba', rol: 'mesero' },
      { id: 'cliente-id', username: 'cliente', nombre: 'Cliente Prueba', rol: 'cliente' },
      { id: 'cliente-id-2', username: 'cliente2', nombre: 'María López', rol: 'cliente' },
      { id: 'cliente-id-3', username: 'cliente3', nombre: 'Pedro Gómez', rol: 'cliente' }
    ];
  }

  getClientesMock(): User[] {
    return this.getUsersMock().filter(user => user.rol === 'cliente');
  }

  searchByNameMock(name: string): User[] {
    const lowerName = name.toLowerCase();
    return this.getUsersMock().filter(user => 
      user.nombre.toLowerCase().includes(lowerName)
    );
  }

  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/exists/usuario/${encodeURIComponent(username)}`)
      .pipe(map(res => res.exists));
  }

  checkNombreExists(nombre: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/exists/nombre/${encodeURIComponent(nombre)}`)
      .pipe(map(res => res.exists));
  }

  // Buscar usuario por PIN
  searchByPin(pin: string): Observable<string | null> {
    return this.http.get<{ resultado?: string; mensaje?: string }>(`${this.apiUrl}/search-by-pin?pin=${encodeURIComponent(pin)}`)
      .pipe(map(res => res.resultado ? res.resultado : null));
  }

  checkPinExists(pin: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/exists/pin/${encodeURIComponent(pin)}`)
      .pipe(map(res => res.exists));
  }

  // Buscar usuario por PIN (devuelve el usuario completo)
  findByPin(pin: string): Observable<UserDTO | null> {
    return this.http.get<UserDTO | null>(`${this.apiUrl}/find-by-pin/${encodeURIComponent(pin)}`);
  }
} 