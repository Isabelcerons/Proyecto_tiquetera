import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { CacheService } from '../services/cache.service';
import { CACHE_KEY, CACHE_TTL } from '../decorators/cache.decorator';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const handler = context.getHandler();
    const key = this.reflector.get<string>(CACHE_KEY, handler);
    const ttl = this.reflector.get<number>(CACHE_TTL, handler);

    if (!key) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const cacheKey = this.cacheService.generateKey(key, {
      ...request.params,
      ...request.query,
    });

    try {
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        return of(cached);
      }

      return next.handle().pipe(
        tap(async (data) => {
          await this.cacheService.set(cacheKey, data, ttl);
        }),
      );
    } catch (error) {
      return next.handle();
    }
  }
} 