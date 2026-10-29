import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { CacheService } from '../services/cache.service';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const useRedis = configService.get('CACHE_REDIS_ENABLED') === 'true';
        
        if (useRedis) {
          return {
            store: redisStore,
            host: configService.get('CACHE_REDIS_HOST', 'localhost'),
            port: configService.get('CACHE_REDIS_PORT', 6379),
            ttl: configService.get('CACHE_TTL', 300), // 5 minutos por defecto
            max: configService.get('CACHE_MAX_ITEMS', 100),
          };
        }
        
        // Fallback a caché en memoria si no está configurado Redis
        return {
          ttl: configService.get('CACHE_TTL', 300),
          max: configService.get('CACHE_MAX_ITEMS', 100),
        };
      },
    }),
  ],
  providers: [CacheService],
  exports: [NestCacheModule, CacheService],
})
export class CacheModule {} 