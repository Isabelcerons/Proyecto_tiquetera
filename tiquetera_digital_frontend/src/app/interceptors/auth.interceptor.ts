import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storage: Storage) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    
    if (!isApiUrl) {
      return next.handle(request);
    }
    
    // Convertir promesa de Storage a Observable
    return from(this.getToken()).pipe(
      switchMap(token => {
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
        }
        return next.handle(request);
      })
    );
  }
  
  private async getToken(): Promise<string | null> {
    // Verificar si el storage está inicializado
    if (!this.storage) {
      return null;
    }
    
    try {
      return await this.storage.get('token');
    } catch (error) {
      console.error('Error al obtener token:', error);
      return null;
    }
  }
} 