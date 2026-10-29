import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private storage: Storage) {
    // Inicializar el storage al crear el interceptor
    this.initStorage();
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Solo interceptar peticiones a nuestra API
    if (!request.url.startsWith(environment.apiUrl)) {
      return next.handle(request);
    }

    console.log('JwtInterceptor: Interceptando solicitud a', request.url);
    
    // Convertir la promesa en observable
    return from(this.getToken()).pipe(
      switchMap((token) => {
        console.log('JwtInterceptor: Token obtenido', token ? 'Sí' : 'No');
        
        if (token) {
          const cloned = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('JwtInterceptor: Enviando solicitud con token');
          return next.handle(cloned);
        }
        
        console.log('JwtInterceptor: Enviando solicitud sin token');
        return next.handle(request);
      })
    );
  }

  private async getToken(): Promise<string | null> {
    // Asegurarse de que el storage está inicializado
    if (!this.storage) {
      console.log('JwtInterceptor: Storage no inicializado, inicializándolo...');
      await this.initStorage();
    }
    
    try {
      const token = await this.storage.get('token');
      console.log('JwtInterceptor: Token recuperado del storage:', token ? 'Sí (con valor)' : 'No (null o undefined)');
      return token;
    } catch (error) {
      console.error('JwtInterceptor: Error al obtener token del storage', error);
      return null;
    }
  }

  private async initStorage() {
    try {
      await this.storage.create();
      console.log('JwtInterceptor: Storage inicializado correctamente');
    } catch (error) {
      console.error('JwtInterceptor: Error al inicializar storage', error);
    }
  }
} 