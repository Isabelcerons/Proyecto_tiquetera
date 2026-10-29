import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError, from } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage-angular';

export interface User {
  id: string;
  username: string;
  nombre: string;
  rol: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    role: string;
    nombre: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private storageReady = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastCtrl: ToastController,
    private storage: Storage
  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
    this.storageReady = true;
    this.loadStoredUser();
  }

  async loadStoredUser() {
    if (!this.storageReady) {
      await this.initStorage();
    }
    
    const token = await this.storage.get('token');
    const userData = await this.storage.get('user');
    
    if (token && userData) {
      this.currentUserSubject.next(userData);
    }
  }

  login(credentials: { usuario: string; contrasena: string }): Observable<AuthResponse> {
    const backendCredentials = {
      username: credentials.usuario,
      password: credentials.contrasena
    };

    console.log('Enviando credenciales al backend:', backendCredentials);
    console.log('URL del API:', `${environment.apiUrl}/auth/login`);

    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, backendCredentials)
      .pipe(
        switchMap(response => {
          console.log('Respuesta del backend:', response);
          const user: User = {
            id: response.user.id,
            username: response.user.username,
            nombre: response.user.nombre,
            rol: response.user.role
          };
          // Esperar a que se guarde el token antes de emitir el resultado
          return from(this.storeAuthData({
            token: response.access_token,
            user: user
          })).pipe(
            map(() => {
              this.currentUserSubject.next(user);
              return response;
            })
          );
        }),
        catchError(async (error: HttpErrorResponse) => {
          console.error('Error en login:', error);
          console.error('Status:', error.status);
          console.error('Message:', error.message);
          console.error('Error body:', error.error);

          let errorMessage = 'Error al iniciar sesión';
          
          if (error.status === 0) {
            errorMessage = 'No se puede conectar al servidor. Verifique su conexión a internet.';
          } else if (error.status === 401) {
            errorMessage = 'Credenciales inválidas. Verifique su usuario y contraseña.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          const toast = await this.toastCtrl.create({
            message: errorMessage,
            duration: 3000,
            position: 'bottom',
            color: 'danger'
          });
          toast.present();
          
          throw new Error(errorMessage);
        })
      );
  }

  loginWithPin(credentials: { cedula: string; pin: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login-pin`, credentials)
      .pipe(
        tap(async response => {
          await this.storeAuthData({
            token: response.access_token,
            user: {
              id: response.user.id,
              username: response.user.username,
              nombre: response.user.nombre,
              rol: response.user.role
            }
          });
          this.currentUserSubject.next({
            id: response.user.id,
            username: response.user.username,
            nombre: response.user.nombre,
            rol: response.user.role
          });
        }),
        catchError(async error => {
          const toast = await this.toastCtrl.create({
            message: error.error?.message || 'Error al iniciar sesión',
            duration: 3000,
            position: 'bottom',
            color: 'danger'
          });
          toast.present();
          
          throw error;
        })
      );
  }

  // Para usuarios de prueba
  async loginMockUser(userData: User): Promise<void> {
    const mockResponse = {
      token: 'fake-token-for-development',
      user: userData
    };
    
    await this.storeAuthData(mockResponse);
    this.currentUserSubject.next(userData);
    
    const toast = await this.toastCtrl.create({
      message: 'Inicio de sesión exitoso',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }

  private async storeAuthData(response: { token: string, user: User }): Promise<void> {
    if (!this.storageReady) {
      await this.initStorage();
    }
    await this.storage.set('token', response.token);
    await this.storage.set('user', response.user);
  }

  async logout(): Promise<void> {
    if (!this.storageReady) {
      await this.initStorage();
    }
    
    await this.storage.remove('token');
    await this.storage.remove('user');
    this.currentUserSubject.next(null);
    
    // Mostrar mensaje de sesión cerrada
    const toast = await this.toastCtrl.create({
      message: 'Sesión cerrada correctamente',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
    
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getUserRole(): string | null {
    return this.currentUserSubject.value?.rol || null;
  }

  hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }
} 