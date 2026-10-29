import { Module } from '@nestjs/common';
import { CacheModule } from './cache/cache.module';
import { CacheService } from './services/cache.service';

@Module({
  imports: [CacheModule],
  providers: [CacheService],
  exports: [CacheModule, CacheService]
})
export class CommonModule {} 