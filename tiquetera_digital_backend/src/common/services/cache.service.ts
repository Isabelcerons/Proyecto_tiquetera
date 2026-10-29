import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly defaultTTL = 300; // 5 minutos por defecto

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Obtiene un valor del caché
   */
  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  /**
   * Almacena un valor en el caché
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  /**
   * Elimina un valor del caché
   */
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  /**
   * Genera una clave única para el caché basada en parámetros
   */
  generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, any>);

    return `${prefix}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * Obtiene un valor desde la caché o ejecuta la función si no existe
   * @param key Clave para almacenar en caché
   * @param fetchFn Función que se ejecuta para obtener los datos si no están en caché
   * @param ttl Tiempo de vida en segundos
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = this.defaultTTL,
  ): Promise<T> {
    try {
      // Intentar obtener desde caché
      const cachedData = await this.cacheManager.get<T>(key);
      
      if (cachedData) {
        this.logger.debug(`Cache hit: ${key}`);
        return cachedData;
      }

      // No está en caché, ejecutar función y almacenar
      this.logger.debug(`Cache miss: ${key}`);
      const data = await fetchFn();
      await this.cacheManager.set(key, data, ttl);
      return data;
    } catch (error) {
      this.logger.error(`Error en caché: ${error.message}`, error.stack);
      // En caso de error, ejecutar la función sin caché
      return fetchFn();
    }
  }

  /**
   * Invalida una clave de caché específica
   */
  async invalidate(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      this.logger.debug(`Cache invalidated: ${key}`);
    } catch (error) {
      this.logger.error(`Error al invalidar caché: ${error.message}`);
    }
  }

  /**
   * Invalida todas las claves que coincidan con un patrón
   */
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      // Cambiado de store.keys() a stores.get('memory').keys() o simplemente no usar patrones
      // Esta es una solución simple que funciona solo con el store de memoria
      // En una implementación real, se requeriría una solución específica para Redis
      
      // Alternativa 1: Si no necesitamos patrones, podemos eliminar esta función
      this.logger.warn(`La función invalidatePattern está deshabilitada por compatibilidad - ${pattern}`);
      
      // Alternativa 2: Implementar una solución específica para el store utilizado
      // Si es un store de memoria o Redis, podemos usar una implementación personalizada
      
      /*
      let keys: string[] = [];
      if (this.cacheManager.store.name === 'redis') {
        // Implementación para Redis - requiere acceso al cliente Redis
        // const redisClient = this.cacheManager.store.getClient();
        // keys = await redisClient.keys(`*${pattern}*`);
      } else {
        // Implementación para memoria - solo para desarrollo
        // No es posible obtener todas las claves en las versiones recientes
      }
      
      for (const key of keys) {
        await this.cacheManager.del(key);
      }
      */
      
    } catch (error) {
      this.logger.error(`Error al invalidar patrón: ${error.message}`);
    }
  }
} 