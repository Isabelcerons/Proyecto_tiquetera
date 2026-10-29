import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY = 'cache:key';
export const CACHE_TTL = 'cache:ttl';

export interface CacheOptions {
  key?: string;
  ttl?: number;
}

export const Cache = (options: CacheOptions = {}) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(CACHE_KEY, options.key || propertyKey)(target, propertyKey, descriptor);
    SetMetadata(CACHE_TTL, options.ttl)(target, propertyKey, descriptor);
    return descriptor;
  };
}; 