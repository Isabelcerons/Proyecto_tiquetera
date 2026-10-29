import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private toastCtrl: ToastController,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error en la comunicación con el servidor';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.status === 401) {
        // Error de autenticación
        errorMessage = 'Su sesión ha expirado. Por favor inicie sesión nuevamente';
        // Cerrar la sesión si el token expiró
        this.authService.logout();
      } else if (error.status === 403) {
        // Error de autorización
        errorMessage = 'No tiene permisos para realizar esta acción';
      } else if (error.error && error.error.message) {
        // Error con mensaje del backend
        errorMessage = error.error.message;
      } else {
        // Otros errores
        errorMessage = `Error ${error.status}: ${error.statusText}`;
      }
    }
    
    // Mostrar mensaje de error
    this.showErrorMessage(errorMessage);
    
    // Retornar el error para que la aplicación pueda manejarlo
    return throwError(() => error);
  }

  private async showErrorMessage(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger',
      buttons: [
        {
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }
} 